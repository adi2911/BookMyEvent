import {
  Consumer,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@adbookmyevent/common";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export const queueGroupName = "payments-service";

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.CANCELLED });
    await order.save();
    msg.ack();
  }
}
