import express, { Request, Response } from 'express';
import { NotFoundError } from '@dbmusicapp/common';
import { UserMessage } from '../../models/user-message';
import { currentUser } from '@dbmusicapp/common';

const router = express.Router();

router.patch(
  '/api/users/messages/read-all',
  currentUser,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;

    await UserMessage.updateMany(
      { userId },
      { $set: { 'messages.$[].read': true } }
    );

    res
      .status(200)
      .send({ message: 'Усі повідомлення позначені як прочитані' });
  }
);

export { router as markMessagesAsReadRouter };
