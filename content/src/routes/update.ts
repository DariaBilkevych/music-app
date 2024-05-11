import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@dbmusicapp/common';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../cloudinary';
import { AudioFile } from '../models/audio-file';
import fs from 'fs';
import { ContentUpdatedPublisher } from '../events/publishers/content-updated-publisher';
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

router.put(
  '/api/content/:id',
  requireAuth,
  upload.single('file'),
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
        req.body,
        {
          ...req.body,
          new: true,
        }
      );

      if (!audioFile) {
        throw new NotFoundError();
      }

      new ContentUpdatedPublisher(natsWrapper.client).publish({
        id: audioFile.id,
        title: audioFile.title,
        artist: audioFile.artist,
        album: audioFile.album,
        year: audioFile.year,
        duration: audioFile.duration,
        src: audioFile.src,
        userId: audioFile.userId,
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
