import { Consumer, OrderCreatedEvent, Subjects } from "@adbookmyevent/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export const queueGroupName = "expiration-service";
export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, expiresAt } = data;
    const delay = new Date(expiresAt).getTime() - new Date().getTime();
    console.log("Expires in", delay);
    //add a job in the queue
    await expirationQueue.add(
      {
        orderId: id,
      },
      {
        delay: delay, //expiresAt in milliseconds
      }
    );
    msg.ack();
  }
}
