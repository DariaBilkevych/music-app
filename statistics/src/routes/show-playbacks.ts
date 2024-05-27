import express, { Request, Response } from 'express';
import { Listening } from '../models/listening';
import { requireAuth } from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/statistics/playbacks',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const playbacks = await Listening.find().populate('audioFileId');
      res.status(200).send(playbacks);
    } catch (err) {
      res
        .status(500)
        .send({ error: 'An error occurred while retrieving playbacks.' });
    }
  }
);

export { router as showPlaybacksRouter };
