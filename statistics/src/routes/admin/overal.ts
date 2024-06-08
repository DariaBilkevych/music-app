import express, { Request, Response } from 'express';
import { AudioFile } from '../../models/audio-file';
import { Listening } from '../../models/listening';
import { User } from '../../models/user';
import { requireAdmin } from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/statistics/admin/overal-stats',
  requireAdmin,
  async (req: Request, res: Response) => {
    const totalUsers = await User.countDocuments();
    const totalSongs = await AudioFile.countDocuments();
    const totalPlays = await Listening.aggregate([
      {
        $group: {
          _id: null,
          totalPlays: { $sum: '$playCount' },
        },
      },
    ]);

    const topSong = await Listening.aggregate([
      {
        $group: {
          _id: '$audioFileId',
          totalPlays: { $sum: '$playCount' },
        },
      },
      {
        $sort: { totalPlays: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'audiofiles',
          localField: '_id',
          foreignField: '_id',
          as: 'audioFile',
        },
      },
      {
        $unwind: '$audioFile',
      },
      {
        $project: {
          _id: 0,
          title: '$audioFile.title',
          artist: '$audioFile.artist',
          totalPlays: 1,
        },
      },
    ]);

    const topArtist = await Listening.aggregate([
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
        $group: {
          _id: '$audioFile.artist',
          totalPlays: { $sum: '$playCount' },
        },
      },
      {
        $sort: { totalPlays: -1 },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          artist: '$_id',
          totalPlays: 1,
        },
      },
    ]);

    const topGenre = await AudioFile.aggregate([
      {
        $unwind: '$genre',
      },
      {
        $lookup: {
          from: 'listenings',
          localField: '_id',
          foreignField: 'audioFileId',
          as: 'listenings',
        },
      },
      {
        $unwind: '$listenings',
      },
      {
        $group: {
          _id: '$genre',
          totalPlays: { $sum: '$listenings.playCount' },
        },
      },
      {
        $sort: { totalPlays: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    res.send({
      totalUsers,
      totalSongs,
      totalPlays: totalPlays[0]?.totalPlays || 0,
      topSong: topSong[0],
      topArtist: topArtist[0],
      topGenre: topGenre[0],
    });
  }
);

export { router as adminStatsRouter };
