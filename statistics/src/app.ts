import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@dbmusicapp/common';

import { createPlaybackRouter } from './routes/create-playback';
import { showPlaybacksRouter } from './routes/show-playbacks';
import { topArtistsRouter } from './routes/user/top-artist';
import { listeningStatsForAudiosRouter } from './routes/user/listening-for-audios';

import { adminStatsRouter } from './routes/admin/overal';
import { adminTopArtistsRouter } from './routes/admin/top-artists';
import { adminTopSongsRouter } from './routes/admin/top-songs';
import { adminTopGenresRouter } from './routes/admin/top-genres';
import { getContentRouter } from './routes/admin/show-content';
import { searchContentRouter } from './routes/admin/search-files';

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

app.use(searchContentRouter);

app.use(createPlaybackRouter);
app.use(showPlaybacksRouter);
app.use(topArtistsRouter);
app.use(listeningStatsForAudiosRouter);

app.use(adminStatsRouter);
app.use(adminTopArtistsRouter);
app.use(adminTopSongsRouter);
app.use(adminTopGenresRouter);
app.use(getContentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
