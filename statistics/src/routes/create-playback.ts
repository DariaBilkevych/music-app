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

    let listening = await Listening.findOne({
      userId: req.currentUser!.id,
      audioFileId,
    }).populate('audioFileId');

    if (!listening) {
      listening = Listening.build({
        userId: req.currentUser!.id,
        audioFileId,
        timestamps: [new Date()],
        playCount: 1,
      });
    } else {
      listening.timestamps.push(new Date());
      listening.playCount++;
    }

    await listening.save();
    res.status(201).send(listening);
  }
);

export { router as createPlaybackRouter };
