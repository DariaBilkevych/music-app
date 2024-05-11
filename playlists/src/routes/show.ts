import express, { Request, Response } from 'express';
import { Playlist } from '../models/playlist';
import { NotAuthorizedError, NotFoundError } from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/playlists/:playlistId',
  async (req: Request, res: Response) => {
    const playlist = await Playlist.findById(req.params.playlistId).populate(
      'audioFile'
    );

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
