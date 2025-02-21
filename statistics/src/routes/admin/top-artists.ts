import express, { Request, Response } from 'express';
import { Listening } from '../../models/listening';
import { requireAdmin } from '@dbmusicapp/common';
import { getStartEndDates } from '../../utils/dates';

const router = express.Router();

router.get(
  '/api/statistics/admin/top-artists',
  requireAdmin,
  async (req: Request, res: Response) => {
    const period = req.query.period as string;
    const { startDate, endDate } = getStartEndDates(period);

    const topArtists = await Listening.aggregate([
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
          _id: '$audioFile.artist',
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
          artist: '$_id',
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

    res.status(200).send(topArtists);
  }
);

export { router as adminTopArtistsRouter };
