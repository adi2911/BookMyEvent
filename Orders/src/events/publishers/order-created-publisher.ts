import { OrderCreatedEvent, Publisher, Subjects } from "@adbookmyevent/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
