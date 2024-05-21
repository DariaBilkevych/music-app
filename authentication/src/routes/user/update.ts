import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import {
  currentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
} from '@dbmusicapp/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.put(
  '/api/users/:userId',
  [
    body('name').not().isEmpty().withMessage('Введіть Ваше ім’я!'),
    body('email')
      .isEmail()
      .withMessage('Перевірте правильність введення Вашого паролю!'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const userId = req.params.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError();
    }

    const userJwt = jwt.sign(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };
    res.status(200).json(updatedUser);
  }
);

export { router as updateUserRouter };
