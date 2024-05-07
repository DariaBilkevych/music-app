import { Publisher, Subjects, ContentCreatedEvent } from '@dbmusicapp/common';

export class ContentCreatedPublisher extends Publisher<ContentCreatedEvent> {
  readonly subject = Subjects.ContentCreated;
}
