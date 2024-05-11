import { requireAuth } from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import { Playlist } from '../models/playlist';

const router = express.Router();

router.get(
  '/api/playlists',
  requireAuth,
  async (req: Request, res: Response) => {
    const playlists = await Playlist.find({
      userId: req.currentUser!.id,
    }).populate('audioFile');

    res.send(playlists);
  }
);

export { router as indexPlaylistRouter };
