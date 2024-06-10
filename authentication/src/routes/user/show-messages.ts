import express, { Request, Response } from 'express';
import { NotFoundError } from '@dbmusicapp/common';
import { UserMessage } from '../../models/user-message';
import { currentUser } from '@dbmusicapp/common';

const router = express.Router();

router.get(
  '/api/users/messages',
  currentUser,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;

    const userMessages = await UserMessage.findOne({ userId });
    res.status(200).send(userMessages);
  }
);

export { router as getUserMessagesRouter };
