import express, { Request, Response } from 'express';
import { AudioFile } from '../../models/audio-file';
import { requireAdmin } from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/statistics/admin/content',
  requireAdmin,
  async (req: Request, res: Response) => {
    const audioFiles = await AudioFile.find({}).populate('userId');

    res.send(audioFiles);
  }
);

export { router as getContentRouter };
