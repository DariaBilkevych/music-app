import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  UserSignedUpEvent,
  UserRoles,
} from '@dbmusicapp/common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserSignedUpListener extends Listener<UserSignedUpEvent> {
  readonly subject = Subjects.UserSignedUp;
  queueGroupName = queueGroupName;

  async onMessage(data: UserSignedUpEvent['data'], msg: Message) {
    const { id, name, email, role } = data;

    if (role === UserRoles.User) {
      const newUser = User.build({
        id,
        name,
        email,
        role,
      });

      await newUser.save();
    }

    msg.ack();
  }
}
