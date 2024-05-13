import express, { Request, Response } from 'express';
import { Playlist } from '../../models/playlist';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/playlists/:playlistId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.currentUser!.id,
    }).populate('audioFiles');

    if (!playlist) {
      throw new NotFoundError();
    }

    if (playlist.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(playlist);
  }
);

export { router as showPlaylistRouter };
