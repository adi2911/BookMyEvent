import { Consumer, Subjects, TicketCreatedEvent } from "@adbookmyevent/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";

export const queueGroupName = "orders-service";

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });

    await ticket.save();
    msg.ack();
  }
}
