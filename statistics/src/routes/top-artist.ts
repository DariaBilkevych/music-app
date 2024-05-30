import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@dbmusicapp/common';
import { Listening } from '../models/listening';
import moment from 'moment';

const router = express.Router();

router.get(
  '/api/statistics/top-artists',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { period } = req.query;
    let startDate, endDate;

    if (period === 'day') {
      startDate = moment().startOf('day');
      endDate = moment().endOf('day');
    } else if (period === 'week') {
      startDate = moment().startOf('week');
      endDate = moment().endOf('week');
    } else if (period === 'month') {
      startDate = moment().startOf('month');
      endDate = moment().endOf('month');
    } else if (period === 'year') {
      startDate = moment().startOf('year');
      endDate = moment().endOf('year');
    } else {
      throw new BadRequestError('Invalid period');
    }

    console.log(startDate, endDate);

    const topArtists = await Listening.aggregate([
      {
        $match: {
          userId,
          timestamps: {
            $elemMatch: {
              $gte: startDate.toDate(),
              $lte: endDate.toDate(),
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
        $unwind: '$timestamps',
      },
      {
        $match: {
          timestamps: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$audioFile.artist',
          totalPlayCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { totalPlayCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).send(topArtists);
  }
);

export { router as topArtistsRouter };
