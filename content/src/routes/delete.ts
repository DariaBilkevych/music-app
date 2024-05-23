import express, { Request, Response } from 'express';
import { AudioFile } from '../models/audio-file';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@dbmusicapp/common';

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
    res.status(204).send();
  }
);

export { router as deleteContentRouter };
