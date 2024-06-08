import express, { Request, Response } from 'express';
import { User } from '../../models/user';

const router = express.Router();

router.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
});

export { router as getAllUsersRouter };
