import express, { Request, Response } from 'express';
import { Playlist } from '../../models/playlist';
import { AudioFile } from '../../models/audio-file';
import {
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
  requireAuth,
} from '@dbmusicapp/common';

const router = express.Router();

router.post(
  '/api/playlists/:playlistId/add-audio',
  requireAuth,
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const { audioFileId } = req.body;
    console.log([playlistId, audioFileId]);

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

    const existingAudioFileIndex = playlist.audioFiles.findIndex((audio) =>
      audio.equals(audioFile._id)
    );

    if (existingAudioFileIndex !== -1) {
      throw new BadRequestError(
        'This audio file already exists in the playlist'
      );
    }

    playlist.audioFiles.push(audioFile._id);
    await playlist.save();

    await playlist.populate('audioFiles');
    res.status(201).send(playlist);
  }
);

export { router as addAudioFileToPlaylistRouter };
