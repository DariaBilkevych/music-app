import { requireAuth } from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import { AudioFile } from '../models/audio-file';

const router = express.Router();

router.get(
  '/api/content/user-content',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const audioFiles = await AudioFile.find({ userId });

    res.send(audioFiles);
  }
);

export { router as showAllUserConentRouter };
