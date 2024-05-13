import express, { Request, Response } from 'express';
import { Playlist } from '../../models/playlist';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@dbmusicapp/common';

const router = express.Router();

router.delete(
  '/api/playlists/:playlistId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.currentUser!.id,
    });

    if (!playlist) {
      throw new NotFoundError();
    }

    if (playlist.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await Playlist.findByIdAndDelete(playlistId);
    res.status(204).send();
  }
);

export { router as deletePlaylistRouter };
