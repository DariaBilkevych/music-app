import { Publisher, Subjects, ContentUpdatedEvent } from '@dbmusicapp/common';

export class ContentUpdatedPublisher extends Publisher<ContentUpdatedEvent> {
  readonly subject = Subjects.ContentUpdated;
}
