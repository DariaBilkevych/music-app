import { requireAuth } from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../cloudinary';
import { AudioFile } from '../models/audio-file';
import fs from 'fs';

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
  upload.single('file'),
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
              });

            if (audioFile) {
              await audioFile.save();
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
