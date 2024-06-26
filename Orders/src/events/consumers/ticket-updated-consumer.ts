import {
  BadRequestError,
  Consumer,
  Subjects,
  TicketUpdatedEvent,
} from "@adbookmyevent/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { queueGroupName } from "./ticket-created-consumer";

export class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent({
      id: data.id,
      version: data.version,
    });

    console.log(
      "Listening to TicketUpdated event:",
      data,
      "ticket received",
      ticket
    );
    if (!ticket) {
      throw new BadRequestError("Ticket not found");
    }
    ticket.set({
      title: data.title,
      price: data.price,
    });

    await ticket.save();
    msg.ack();
  }
}
