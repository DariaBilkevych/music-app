import express, { Request, Response } from 'express';
import { Playlist } from '../models/playlist';
import { NotAuthorizedError, NotFoundError } from '@dbmusicapp/common';

const router = express.Router();

router.delete(
  '/api/playlists/:playlistId',
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new NotFoundError();
    }

    if (playlist.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    await playlist.save();

    res.status(204).send(playlist);
  }
);

export { router as deletePlaylistRouter };
