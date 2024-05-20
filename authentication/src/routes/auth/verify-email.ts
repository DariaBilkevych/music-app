import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { NotFoundError } from '@dbmusicapp/common';

const router = express.Router();

router.get('/api/users/verify/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  const decodedToken = jwt.verify(token, process.env.JWT_KEY!) as {
    userId: string;
  };

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new NotFoundError();
  }

  user.emailVerified = true;
  await user.save();

  res.redirect('/auth/signin');
});

export { router as emailVerificationRouter };
