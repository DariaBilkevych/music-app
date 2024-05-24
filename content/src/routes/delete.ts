import express, { Request, Response } from 'express';
import { AudioFile } from '../models/audio-file';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@dbmusicapp/common';
import { natsWrapper } from '../nats-wrapper';
import { ContentDeletedPublisher } from '../events/publishers/content-deleted-publisher';

const router = express.Router();

router.delete(
  '/api/content/:audioFileId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { audioFileId } = req.params;
    const audioFile = await AudioFile.findOne({
      _id: audioFileId,
      userId: req.currentUser!.id,
    });

    if (!audioFile) {
      throw new NotFoundError();
    }

    if (audioFile.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await AudioFile.findByIdAndDelete(audioFileId);

    await new ContentDeletedPublisher(natsWrapper.client).publish({
      id: audioFile.id,
    });

    res.status(204).send();
  }
);

export { router as deleteContentRouter };
