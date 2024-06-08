import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { ContentCreatedListener } from './events/listeners/content-created-listener';
import { ContentUpdatedListener } from './events/listeners/content-updated-listener';
import { ContentDeletedListener } from './events/listeners/content-deleted-listener';
import { UserSignedUpListener } from './events/listeners/user-signed-up-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGIN', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ContentCreatedListener(natsWrapper.client).listen();
    new ContentUpdatedListener(natsWrapper.client).listen();
    new ContentDeletedListener(natsWrapper.client).listen();
    new UserSignedUpListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
