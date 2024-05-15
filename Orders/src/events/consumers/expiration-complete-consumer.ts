import {
  BadRequestError,
  Consumer,
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@adbookmyevent/common";
import { queueGroupName } from "./ticket-created-consumer";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteConsumer extends Consumer<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new BadRequestError("No order found");
    }

    if (order.status === OrderStatus.COMPLETE) {
      msg.ack();
      return;
    }
    order.set({
      status: OrderStatus.CANCELLED,
    });
    await order.save();

    //emit order cancelled event
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    msg.ack();
  }
}
