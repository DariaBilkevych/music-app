import express, { Request, Response } from 'express';
import { Playlist } from '../../models/playlist';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@dbmusicapp/common';

const router = express.Router();

router.put(
  '/api/playlists/:playlistId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const { title } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new NotFoundError();
    }

    if (playlist.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const existingPlaylist = await Playlist.findOne({
      userId: req.currentUser!.id,
      title,
    });

    if (existingPlaylist && existingPlaylist.id !== playlistId) {
      throw new BadRequestError('A playlist with this title already exists');
    }

    playlist.set({ title });
    await playlist.save();

    await playlist.populate('audioFiles');
    res.status(200).send(playlist);
  }
);

export { router as updatePlaylistRouter };
