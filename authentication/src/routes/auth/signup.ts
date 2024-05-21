import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestError,
  UserRoles,
} from '@dbmusicapp/common';
import { User } from '../../models/user';
import { sendVerificationEmail } from '../../services/email';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('name').not().isEmpty().withMessage('Введіть Ваше ім’я!'),
    body('email')
      .isEmail()
      .withMessage('Перевірте правильність введення Вашого паролю!'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Пароль має бути від 8 до 20 символів!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(
        'Ця електронна адреса вже використовується! Авторизуйтесь, будь ласка!'
      );
    }

    const user = User.build({
      name,
      email,
      password,
      role: UserRoles.User,
      emailVerified: false,
    });

    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_KEY!,
      { expiresIn: '1h' }
    );
    await sendVerificationEmail(user.email, verificationToken);

    await user.save();
    res.status(201).send(user);
  }
);

export { router as signupRouter };
