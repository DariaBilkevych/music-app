import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  UserSignedUpEvent,
  UserRoles,
} from '@dbmusicapp/common';
import { Playlist } from '../../models/playlist';
import { queueGroupName } from './queue-group-name';

export class UserSignedUpListener extends Listener<UserSignedUpEvent> {
  readonly subject = Subjects.UserSignedUp;
  queueGroupName = queueGroupName;

  async onMessage(data: UserSignedUpEvent['data'], msg: Message) {
    const { id, role } = data;

    if (role === UserRoles.User) {
      const favoritePlaylist = Playlist.build({
        userId: id,
        title: 'Улюблене',
        audioFiles: [],
      });

      await favoritePlaylist.save();
    }

    msg.ack();
  }
}
