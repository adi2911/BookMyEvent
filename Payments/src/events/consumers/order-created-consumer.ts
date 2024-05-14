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
      price: data.ticket.price,
      id: data.id,
      status: data.status,
      version: data.version,
      userId: data.userId,
    });
    await order.save();
    msg.ack();
  }
}
