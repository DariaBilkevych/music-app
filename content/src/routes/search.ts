import express, { Request, Response } from 'express';
import { AudioFile } from '../models/audio-file';
import { BadRequestError } from '@dbmusicapp/common';

const router = express.Router();

router.get('/api/content/search', async (req: Request, res: Response) => {
  const { query } = req.query;

  if (typeof query !== 'string') {
    throw new BadRequestError('Query parameter must be a string');
  }

  const regex = new RegExp(query, 'i');

  const audioFiles = await AudioFile.find({
    $or: [
      { title: { $regex: regex } },
      { artist: { $regex: regex } },
      { genre: { $regex: regex } },
    ],
  });

  res.send(audioFiles);
});

export { router as searchContentRouter };
