import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import { errorHandler, NotFoundError } from '@dbmusicapp/common';

import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';
import { signupRouter } from './routes/auth/signup';

import { currentUserRouter } from './routes/user/current-user';
import { updateUserRouter } from './routes/user/update';

import { emailVerificationRouter } from './routes/auth/verify-email';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

dotenv.config();

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(currentUserRouter);
app.use(updateUserRouter);

app.use(emailVerificationRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
