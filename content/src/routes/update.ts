import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../cloudinary';
import { AudioFile } from '../models/audio-file';
import fs from 'fs';
import { body } from 'express-validator';
import { ContentUpdatedPublisher } from '../events/publishers/content-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Genre } from '@dbmusicapp/common';

const router = express.Router();

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = './src/uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.put(
  '/api/content/:id',
  requireAuth,
  upload.single('file'),
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage(
        'Назва є обов’язковою та повинна містити від 1 до 20 символів'
      ),
    body('artist')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage(
        'Виконавець є обов’язковим та повинен містити від 1 до 50 символів'
      ),
    body('genre')
      .isArray({ min: 1 })
      .withMessage('Потрібно вибрати хоча б один жанр')
      .custom((value: any[]) => {
        const genres = Object.values(Genre);
        value.forEach((genre) => {
          if (!genres.includes(genre as Genre)) {
            throw new Error(`Жанр "${genre}" недійсний`);
          }
        });
        return true;
      }),
    body('year')
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage('Рік випуску має бути від 1900 до поточного року'),
    body('duration')
      .isFloat({ min: 0.01 })
      .withMessage('Тривалість має бути числом більше 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      // If there's a file uploaded, update the file and path
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'musicapp',
          use_filename: true,
          resource_type: 'raw',
        });

        req.body.src = result.url;
      }

      const audioFile = await AudioFile.findByIdAndUpdate(
        req.params.id,
        { $inc: { version: 1 }, $set: req.body },
        { new: true, runValidators: true }
      );

      if (!audioFile) {
        throw new NotFoundError();
      }

      new ContentUpdatedPublisher(natsWrapper.client).publish({
        id: audioFile.id,
        title: audioFile.title,
        artist: audioFile.artist,
        genre: audioFile.genre,
        year: audioFile.year,
        duration: audioFile.duration,
        src: audioFile.src,
        userId: audioFile.userId,
        version: audioFile.version,
      });

      res.status(200).send(audioFile);
    } catch (err) {
      res.status(500).send({
        message: 'Error updating song',
        success: false,
        data: err,
      });
    }
  }
);

export { router as updateContentRouter };
