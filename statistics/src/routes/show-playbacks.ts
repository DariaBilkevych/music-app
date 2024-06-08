import express, { Request, Response } from 'express';
import { Listening } from '../models/listening';
import { requireAuth } from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/statistics/playbacks',
  requireAuth,
  async (req: Request, res: Response) => {
    const playbacks = await Listening.find().populate('audioFileId');
    res.status(200).send(playbacks);
  }
);

export { router as showPlaybacksRouter };
