import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ContentDeletedEvent } from '@dbmusicapp/common';
import { queueGroupName } from './queue-group-name';
import { UserMessage, UserMessageDoc } from '../../models/user-message';

export class ContentDeletedListener extends Listener<ContentDeletedEvent> {
  readonly subject = Subjects.ContentDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ContentDeletedEvent['data'], msg: Message) {
    const { title, artist, reason, userId } = data;

    if (userId) {
      let userMessage: UserMessageDoc | null = await UserMessage.findOne({
        userId,
      });

      if (!userMessage) {
        userMessage = UserMessage.build({ userId, messages: [] });
      }

      userMessage.messages.push(
        `Ваш аудіофайл ${title} - ${artist} був видалений з сервісу адміністратором. Причина: ${reason}`
      );
      await userMessage.save();
    }

    msg.ack();
  }
}
