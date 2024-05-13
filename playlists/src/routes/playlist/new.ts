import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import { Playlist } from '../../models/playlist';
import { AudioFile } from '../../models/audio-file';

const router = express.Router();

router.post(
  '/api/playlists',
  requireAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage(
        'Playlist title is required and must be between 1 and 255 characters'
      ),
    body('audioFiles')
      .isArray({ min: 1 })
      .withMessage('Playlist must contain at least one audio file'),
    body('audioFiles.*') // Validate each audio file ID
      .isMongoId()
      .withMessage('Invalid audio file ID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, audioFiles } = req.body;

    const existingPlaylist = await Playlist.findOne({
      title,
      userId: req.currentUser!.id,
    });

    if (existingPlaylist) {
      throw new BadRequestError('A playlist with this title already exists');
    }

    const validAudioFiles = await AudioFile.find({ _id: { $in: audioFiles } });

    if (validAudioFiles.length !== audioFiles.length) {
      throw new BadRequestError('One or more audio files not found');
    }

    const playlist = await Playlist.create({
      title,
      userId: req.currentUser!.id,
      audioFiles: validAudioFiles.map((audioFile) => audioFile.id),
    });

    // Populate the audioFiles field with full audio file objects
    await playlist.populate('audioFiles');
    res.status(201).send(playlist);
  }
);

export { router as newPlaylistRouter };
