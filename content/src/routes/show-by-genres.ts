import express, { Request, Response } from 'express';
import { AudioFile } from '../models/audio-file';
import { BadRequestError, Genre } from '@dbmusicapp/common';

const router = express.Router();

router.get('/api/content/genre/:genre', async (req: Request, res: Response) => {
  const genre = req.params.genre;

  if (!Object.values(Genre).includes(genre as Genre)) {
    return res.status(400).send({ error: `Invalid genre: ${genre}` });
  }

  const audioFiles = await AudioFile.find({
    genre: { $in: [genre] },
  });

  res.send(audioFiles);
});

export { router as showByGenreRouter };
