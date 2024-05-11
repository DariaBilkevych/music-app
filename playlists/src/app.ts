import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@dbmusicapp/common';

import { indexPlaylistRouter } from './routes';
import { newPlaylistRouter } from './routes/new';
import { showPlaylistRouter } from './routes/show';
import { updatePlaylistRouter } from './routes/update';
import { deletePlaylistRouter } from './routes/delete';

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

app.use(indexPlaylistRouter);
app.use(newPlaylistRouter);
app.use(showPlaylistRouter);
app.use(updatePlaylistRouter);
app.use(deletePlaylistRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
