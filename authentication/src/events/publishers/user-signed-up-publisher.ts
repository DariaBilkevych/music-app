import { Publisher, Subjects, UserSignedUpEvent } from '@dbmusicapp/common';

export class UserSignedUpPublisher extends Publisher<UserSignedUpEvent> {
  readonly subject = Subjects.UserSignedUp;
}
