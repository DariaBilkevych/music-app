import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { AudioFile } from '../models/audio-file';
import { Playlist } from '../models/playlist';

const router = express.Router();

router.post(
  '/api/playlists',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Назва плейлиста має бути надана!'),
    body('audioFileId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('AudioFileId має бути наданий!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, audioFileId } = req.body;

    // Find the audio file the user is trying to add in database
    const audioFile = await AudioFile.findById(audioFileId);
    if (!audioFile) {
      throw new NotFoundError();
    }

    // Build the playlist and save it to the database
    const playlist = Playlist.build({
      userId: req.currentUser!.id,
      title,
      audioFiles: [audioFileId],
    });
    await playlist.save();

    res.status(201).send(playlist);
  }
);

export { router as newPlaylistRouter };
