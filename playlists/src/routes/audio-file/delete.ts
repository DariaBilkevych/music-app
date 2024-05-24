import express, { Request, Response } from 'express';
import { Playlist } from '../../models/playlist';
import { AudioFile } from '../../models/audio-file';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@dbmusicapp/common';
import mongoose from 'mongoose';

const router = express.Router();

router.delete(
  '/api/playlists/:playlistId/:audioFileId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { playlistId, audioFileId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new NotFoundError();
    }

    if (playlist.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const audioFile = await AudioFile.findById(audioFileId);

    if (!audioFile) {
      throw new NotFoundError();
    }

    playlist.audioFiles = playlist.audioFiles.filter(
      (audioFile: mongoose.Types.ObjectId) =>
        audioFile.toString() !== audioFileId
    );

    playlist.audioFilesCount = playlist.audioFiles.length;

    await playlist.save();
    res.status(204).send();
  }
);

export { router as deleteAudioFileFromPlaylistRouter };
