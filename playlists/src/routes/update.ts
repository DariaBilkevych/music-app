import express, { Request, Response } from 'express';

const router = express.Router();

router.put(
  '/api/playlists/:playlistId',
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as updatePlaylistRouter };
