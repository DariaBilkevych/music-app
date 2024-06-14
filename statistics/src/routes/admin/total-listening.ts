import express, { Request, Response } from 'express';
import { requireAdmin } from '@dbmusicapp/common';
import { Listening } from '../../models/listening';
import { getStartEndDatesMonth } from '../../utils/dates';

const router = express.Router();

router.get(
  '/api/statistics/admin/total-listening',
  requireAdmin,
  async (req: Request, res: Response) => {
    const period = parseInt(req.query.period as string, 10);
    const { startDate, endDate } = getStartEndDatesMonth(period);

    const dateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalListeningStats = await Listening.aggregate([
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
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamps' },
            },
          },
          playCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          playCount: '$playCount',
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    const completeListeningStats = dateRange.map((date) => {
      const stat = totalListeningStats.find((stat) => stat.date === date);
      return {
        date,
        playCount: stat ? stat.playCount : 0,
      };
    });

    res.status(200).json(completeListeningStats);
  }
);

export { router as adminTotalListeningRouter };
