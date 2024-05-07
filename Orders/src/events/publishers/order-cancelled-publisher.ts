import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@adbookmyevent/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
