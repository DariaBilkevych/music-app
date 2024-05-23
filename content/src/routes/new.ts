import { requireAuth, validateRequest } from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../cloudinary';
import { AudioFile } from '../models/audio-file';
import fs from 'fs';
import { body } from 'express-validator';
import { ContentCreatedPublisher } from '../events/publishers/content-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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
        'Виконавець є обов’язковим та повинен містити від 1 до 50 символів'
      ),
    body('album')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage(
        'Альбом є обов’язковим та повинен містити від 1 до 20 символів'
      ),
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
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
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
            const { title, artist, album, year, duration } = req.body;

            const audioFile =
              result &&
              AudioFile.build({
                title,
                artist,
                album,
                year,
                duration,
                src: result.url,
                userId: req.currentUser!.id,
              });

            if (audioFile) {
              await audioFile.save();
              await new ContentCreatedPublisher(natsWrapper.client).publish({
                id: audioFile.id,
                title: audioFile.title,
                artist: audioFile.artist,
                album: audioFile.album,
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
    } catch (err) {
      res.status(500).send({
        message: 'Error adding song',
        success: false,
        data: err,
      });
    }
  }
);

export { router as uploadContentRouter };
