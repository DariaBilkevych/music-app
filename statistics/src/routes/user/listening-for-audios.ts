import express, { Request, Response } from 'express';
import { requireAuth } from '@dbmusicapp/common';
import { Listening } from '../../models/listening';

const router = express.Router();

router.get(
  '/api/statistics/listening-for-audios',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;

    const listeningStatsForAudio = await Listening.aggregate([
      {
        $lookup: {
          from: 'audiofiles',
          localField: 'audioFileId',
          foreignField: '_id',
          as: 'audioFile',
        },
      },
      {
        $unwind: '$audioFile',
      },
      {
        $match: {
          'audioFile.userId': userId,
        },
      },
      {
        $unwind: '$timestamps',
      },
      {
        $group: {
          _id: {
            title: '$audioFile.title',
            date: {
              $dateToString: { format: '%d-%m-%Y', date: '$timestamps' },
            },
          },
          firstDate: { $min: '$timestamps' },
          playCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.title',
          dates: {
            $push: {
              date: '$_id.date',
              playCount: '$playCount',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: '$_id',
          dates: {
            $sortArray: {
              input: '$dates',
              sortBy: { date: 1 },
            },
          },
        },
      },
    ]);

    res.status(200).json(listeningStatsForAudio);
  }
);

export { router as listeningStatsForAudiosRouter };
