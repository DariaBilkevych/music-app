import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../cloudinary';
import { AudioFile } from '../models/audio-file';
import fs from 'fs';
import { body } from 'express-validator';
import { ContentCreatedPublisher } from '../events/publishers/content-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import createFileHash from './services/hash';

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

router.post(
  '/api/content',
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
        'Виконавець є обов’язковим та повинен містити від 1 до 20 символів'
      )
      .custom(async (value, { req }) => {
        const existingFile = await AudioFile.findOne({
          artist: value,
          title: req.body.title,
        });
        if (existingFile) {
          throw new Error(
            'Пісня з такою назвою та виконавцем вже існує на сервісі'
          );
        }
      }),
    body('artist')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage(
        'Виконавець є обов’язковим та повинен містити від 1 до 50 символів'
      ),
    body('genre')
      .isArray({ min: 1 })
      .withMessage('Потрібно вибрати хоча б один жанр'),
    body('year')
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage('Рік випуску має бути від 1900 до поточного року'),
    body('duration')
      .isFloat({ min: 0.01 })
      .withMessage('Тривалість має бути числом більше 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const fileHash = await createFileHash(req.file.path);
    const existingFile = await AudioFile.findOne({ fileHash });

    if (existingFile) {
      throw new BadRequestError(
        'Файл, який Ви намагаєтесь завантажити, не є унікальним'
      );
    }

    await cloudinary.uploader.upload(
      req.file!.path,
      {
        folder: 'musicapp',
        use_filename: true,
        resource_type: 'raw',
      },
      async (err, result) => {
        if (err) {
          console.error('Cloudinary upload error:', err);
          res.status(500).json({ message: 'Cloudinary upload failed!' });
        } else {
          const { title, artist, genre, year, duration } = req.body;

          const audioFile =
            result &&
            AudioFile.build({
              title,
              artist,
              genre,
              year,
              duration,
              fileHash,
              src: result.url,
              userId: req.currentUser!.id,
            });

          if (audioFile) {
            await audioFile.save();
            await new ContentCreatedPublisher(natsWrapper.client).publish({
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

            res.status(201).send(audioFile);
          } else {
            res.status(500).json({ message: 'Result is undefined' });
          }
        }
      }
    );
  }
);

export { router as uploadContentRouter };
