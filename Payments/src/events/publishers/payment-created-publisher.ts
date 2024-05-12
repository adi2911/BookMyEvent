import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@adbookmyevent/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
