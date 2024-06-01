import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ContentCreatedEvent } from '@dbmusicapp/common';
import { AudioFile } from '../../models/audio-file';
import { queueGroupName } from './queue-group-name';

export class ContentCreatedListener extends Listener<ContentCreatedEvent> {
  readonly subject = Subjects.ContentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ContentCreatedEvent['data'], msg: Message) {
    const { id, title, artist, genre, year, duration, src, userId } = data;
    const audioFile = AudioFile.build({
      id,
      title,
      artist,
      genre,
      year,
      duration,
      src,
      userId,
    });

    await audioFile.save();
    msg.ack();
  }
}
