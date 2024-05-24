import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ContentDeletedEvent } from '@dbmusicapp/common';
import { AudioFile } from '../../models/audio-file';
import { Playlist } from '../../models/playlist';
import { queueGroupName } from './queue-group-name';

export class ContentDeletedListener extends Listener<ContentDeletedEvent> {
  readonly subject = Subjects.ContentDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ContentDeletedEvent['data'], msg: Message) {
    const audioFile = await AudioFile.findByIdAndDelete(data.id);

    if (!audioFile) {
      throw new Error('Audiofile not found!');
    }

    const playlists = await Playlist.find({
      audioFiles: { $in: [audioFile._id] },
    });

    for (const playlist of playlists) {
      playlist.audioFilesCount--;
      await playlist.save();
    }

    msg.ack();
  }
}
