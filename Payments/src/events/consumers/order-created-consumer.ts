import {
  Consumer,
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from "@adbookmyevent/common";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export const queueGroupName = "payments-service";

export class OrderCreaterConsumer extends Consumer<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      ...data,
      price: data.ticket.price,
    });
    await order.save();
    msg.ack();
  }
}
