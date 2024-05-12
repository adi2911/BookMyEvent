import {
  BadRequestError,
  Consumer,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@adbookmyevent/common";
import { queueGroupName } from "./ticket-created-consumer";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export class PaymentCreatedConsumer extends Consumer<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: { id: string; orderId: string; stripeId: string },
    msg: Message
  ) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new BadRequestError("Order not found");
    }

    order.set({
      status: OrderStatus.COMPLETE,
    });

    await order.save();
    msg.ack();
  }
}
