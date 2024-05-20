import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { currentUser, requireAuth } from '@dbmusicapp/common';

const router = express.Router();

router.put(
  '/api/users/:userId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const userId = req.params.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );
    res.status(200).json(updatedUser);
  }
);

export { router as updateUserRouter };
