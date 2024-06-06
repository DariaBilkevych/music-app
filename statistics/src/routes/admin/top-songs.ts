import express, { Request, Response } from 'express';
import { requireAuth } from '@dbmusicapp/common';
import { Listening } from '../../models/listening';
import { getStartEndDates } from '../../utils/dates';

const router = express.Router();

router.get(
  '/api/statistics/admin/top-songs',
  requireAuth,
  async (req: Request, res: Response) => {
    const period = req.query.period as string;
    const { startDate, endDate } = getStartEndDates(period);

    const topSongs = await Listening.aggregate([
      {
        $match: {
          timestamps: {
            $gte: startDate,
            $lte: endDate,
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
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$audioFile.title',
          artist: { $first: '$audioFile.artist' },
          totalPlayCount: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          startDate: {
            $dateToString: {
              format: '%d-%m-%Y',
              date: startDate,
            },
          },
          endDate: {
            $dateToString: {
              format: '%d-%m-%Y',
              date: endDate,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: '$_id',
          artist: 1,
          totalPlayCount: 1,
          startDate: 1,
          endDate: 1,
        },
      },
      {
        $sort: { totalPlayCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).send(topSongs);
  }
);

export { router as adminTopSongsRouter };
