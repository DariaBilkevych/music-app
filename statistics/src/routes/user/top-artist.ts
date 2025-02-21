import express, { Request, Response } from 'express';
import { requireAuth } from '@dbmusicapp/common';
import { Listening } from '../../models/listening';
import { getStartEndDates } from '../../utils/dates';

const router = express.Router();

router.get(
  '/api/statistics/top-artists',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const period = req.query.period as string;
    const { startDate, endDate } = getStartEndDates(period);

    const topArtists = await Listening.aggregate([
      {
        $match: {
          userId,
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
        $limit: 5,
      },
    ]);

    res.status(200).send(topArtists);
  }
);

export { router as topArtistsRouter };
