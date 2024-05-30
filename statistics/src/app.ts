import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@dbmusicapp/common';

import { createPlaybackRouter } from './routes/create-playback';
import { showPlaybacksRouter } from './routes/show-playbacks';
import { topArtistsRouter } from './routes/top-artist';
import { listeningStatsForAudiosRouter } from './routes/listening-for-audios';

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

app.use(createPlaybackRouter);
app.use(showPlaybacksRouter);
app.use(topArtistsRouter);
app.use(listeningStatsForAudiosRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
