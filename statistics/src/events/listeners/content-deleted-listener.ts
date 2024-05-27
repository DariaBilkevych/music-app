import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ContentDeletedEvent } from '@dbmusicapp/common';
import { AudioFile } from '../../models/audio-file';
import { queueGroupName } from './queue-group-name';

export class ContentDeletedListener extends Listener<ContentDeletedEvent> {
  readonly subject = Subjects.ContentDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ContentDeletedEvent['data'], msg: Message) {
    const audioFile = await AudioFile.findByIdAndDelete(data.id);

    if (!audioFile) {
      throw new Error('Audiofile not found!');
    }

    msg.ack();
  }
}
