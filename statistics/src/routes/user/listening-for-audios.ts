import express, { Request, Response } from 'express';
import { requireAuth } from '@dbmusicapp/common';
import { Listening } from '../../models/listening';
import { getStartEndDatesMonth } from '../../utils/dates';
import mongoose from 'mongoose';

const router = express.Router();

router.get(
  '/api/statistics/listening-for-audios',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const period = parseInt(req.query.period as string, 10);
    const { startDate, endDate } = getStartEndDatesMonth(period);

    const dateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const listeningStatsForAudio = await Listening.aggregate([
      {
        $match: {
          timestamps: {
            $elemMatch: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
      },
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
          'audioFile.userId': new mongoose.Types.ObjectId(userId),
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
              $dateToString: { format: '%Y-%m-%d', date: '$timestamps' },
            },
          },
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
            $map: {
              input: dateRange,
              as: 'date',
              in: {
                date: '$$date',
                playCount: {
                  $reduce: {
                    input: '$dates',
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ['$$this.date', '$$date'] },
                        '$$this.playCount',
                        '$$value',
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(listeningStatsForAudio);
  }
);

export { router as listeningStatsForAudiosRouter };
