import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@dbmusicapp/common';
import { UserMessage } from '../../models/user-message';

const router = express.Router();

router.get(
  '/api/users/:userId/messages',
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const userMessages = await UserMessage.findOne({ userId });

    if (!userMessages) {
      throw new NotFoundError();
    }

    res.status(200).send(userMessages);
  }
);

export { router as getUserMessagesRouter };
