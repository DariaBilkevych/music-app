import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import { Playlist } from '../../models/playlist';

const router = express.Router();

router.post(
  '/api/playlists',
  requireAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage(
        'Назва плейлиста є обов’язковою і має бути від 1 до 10 символів'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body;

    const existingPlaylist = await Playlist.findOne({
      title,
      userId: req.currentUser!.id,
    });

    if (existingPlaylist) {
      throw new BadRequestError('Плейлист з такою назвою вже існує!');
    }

    const playlist = await Playlist.create({
      title,
      userId: req.currentUser!.id,
      audioFiles: [],
      audioFilesCount: 0,
    });

    // Populate the audioFiles field with full audio file objects
    await playlist.populate('audioFiles');
    res.status(201).send(playlist);
  }
);

export { router as newPlaylistRouter };
