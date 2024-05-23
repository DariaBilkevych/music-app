import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@dbmusicapp/common';

import { uploadContentRouter } from './routes/new';
import { updateContentRouter } from './routes/update';
import { indexContentRouter } from './routes/index';
import { showAllUserConentRouter } from './routes/show';
import { showOneUserContentRouter } from './routes/show-one';
import { deleteContentRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(uploadContentRouter);
app.use(updateContentRouter);
app.use(indexContentRouter);
app.use(showAllUserConentRouter);
app.use(showOneUserContentRouter);
app.use(deleteContentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
