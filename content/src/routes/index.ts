import express, { Request, Response } from 'express';
import { AudioFile } from '../models/audio-file';

const router = express.Router();

router.get('/api/content', async (req: Request, res: Response) => {
  const audioFiles = await AudioFile.find({});

  res.send(audioFiles);
});

export { router as indexContentRouter };
