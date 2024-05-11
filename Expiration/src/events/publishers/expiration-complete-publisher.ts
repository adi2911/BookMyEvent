import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@adbookmyevent/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
