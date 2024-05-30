import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import { Listening } from '../models/listening';
import moment from 'moment-timezone';

const router = express.Router();

router.post(
  '/api/statistics/playback',
  requireAuth,
  async (req: Request, res: Response) => {
    const { audioFileId } = req.body;
    const localTimeString = moment
      .tz('Europe/Kiev')
      .format('YYYY-MM-DDTHH:mm:ss');
    const localTime = new Date(localTimeString);

    let listening = await Listening.findOne({
      userId: req.currentUser!.id,
      audioFileId,
    }).populate('audioFileId');

    if (!listening) {
      listening = Listening.build({
        userId: req.currentUser!.id,
        audioFileId,
        timestamps: [localTime],
        playCount: 1,
      });
    } else {
      listening.timestamps.push(localTime);
      listening.playCount++;
    }

    await listening.save();
    res.status(201).send(listening);
  }
);

export { router as createPlaybackRouter };
