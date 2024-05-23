import { Publisher, Subjects, ContentDeletedEvent } from '@dbmusicapp/common';

export class ContentDeletedPublisher extends Publisher<ContentDeletedEvent> {
  readonly subject = Subjects.ContentDeleted;
}
