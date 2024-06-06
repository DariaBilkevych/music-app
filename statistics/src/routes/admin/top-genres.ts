import express, { Request, Response } from 'express';
import { Listening } from '../../models/listening';
import { requireAdmin } from '@dbmusicapp/common';
import { getStartEndDates } from '../../utils/dates';

const router = express.Router();

router.get(
  '/api/statistics/admin/top-genres',
  requireAdmin,
  async (req: Request, res: Response) => {
    const period = req.query.period as string;
    const { startDate, endDate } = getStartEndDates(period);

    const topGenres = await Listening.aggregate([
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
        $unwind: '$audioFile.genre',
      },
      {
        $match: {
          'audioFile.genre': { $exists: true, $ne: [] },
          timestamps: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$audioFile.genre',
          totalPlayCount: { $sum: '$playCount' },
        },
      },
      {
        $sort: { totalPlayCount: -1 },
      },
      {
        $limit: 5,
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
          genre: '$_id',
          totalPlayCount: 1,
          startDate: 1,
          endDate: 1,
        },
      },
    ]);

    res.status(200).send(topGenres);
  }
);

export { router as adminTopGenresRouter };
