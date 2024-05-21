import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { NotFoundError } from '@dbmusicapp/common';
import { sendVerificationEmail } from '../../services/email';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/resend-verification-email',
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (user.emailVerified) {
      return res.status(400).send('Пошта вже підтверджена!');
    }

    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_KEY!,
      { expiresIn: '1h' }
    );
    await sendVerificationEmail(user.email, verificationToken);

    await user.save();
    res.status(201).send(`Verification send to ${user.email}`);
  }
);

export { router as resendVerificationEmailRouter };
