import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ContentUpdatedEvent } from '@dbmusicapp/common';
import { AudioFile } from '../../models/audio-file';
import { queueGroupName } from './queue-group-name';

export class ContentUpdatedListener extends Listener<ContentUpdatedEvent> {
  readonly subject = Subjects.ContentUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ContentUpdatedEvent['data'], msg: Message) {
    const audioFile = await AudioFile.findByIdAndUpdate(
      data.id,
      { $set: data },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!audioFile) {
      throw new Error('Audiofile not found!');
    }

    const { title, artist, album, year, duration, src } = data;
    audioFile.set({ title, artist, album, year, duration, src });
    await audioFile.save();

    msg.ack();
  }
}
