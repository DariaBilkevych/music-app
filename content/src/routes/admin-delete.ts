import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { AudioFile } from '../models/audio-file';
import {
  NotFoundError,
  requireAdmin,
  validateRequest,
} from '@dbmusicapp/common';
import { natsWrapper } from '../nats-wrapper';
import { ContentDeletedPublisher } from '../events/publishers/content-deleted-publisher';

const router = express.Router();

router.delete(
  '/api/content/admin/:audioFileId',
  requireAdmin,
  [
    body('reason')
      .not()
      .isEmpty()
      .withMessage('Вкажіть причину видалення треку'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { audioFileId } = req.params;
    const { reason } = req.body;

    const audioFile = await AudioFile.findById(audioFileId);

    if (!audioFile) {
      throw new NotFoundError();
    }

    const userId = audioFile.userId;

    await AudioFile.findByIdAndDelete(audioFileId);

    await new ContentDeletedPublisher(natsWrapper.client).publish({
      id: audioFile.id,
      title: audioFile.title,
      artist: audioFile.artist,
      userId: userId,
      reason: reason,
    });

    res.status(204).send();
  }
);

export { router as deleteContentAdminRouter };
