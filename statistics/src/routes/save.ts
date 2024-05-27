import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import { Listening } from '../models/listening';

const router = express.Router();

router.post(
  '/api/statistics/playback',
  requireAuth,
  async (req: Request, res: Response) => {
    const { audioFileId } = req.body;

    const listening = Listening.build({
      userId: req.currentUser!.id,
      audioFileId,
      timestamp: new Date(),
    });

    await listening.populate('audioFileId');
    await listening.save();
    res.status(201).send(listening);
  }
);

export { router as savePlaybackRouter };
