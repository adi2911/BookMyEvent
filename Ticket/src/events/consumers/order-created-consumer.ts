import {
  BadRequestError,
  Consumer,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@adbookmyevent/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export const queueGroupName = "tickets-service";
export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //find ticket
    const ticket = await Ticket.findById(data.ticket.id);
    console.log("Listening to OrderCreatedConsumer", ticket);
    //if no ticket throw error
    if (!ticket) {
      throw new BadRequestError("Ticket not foung");
    }
    //set the orderid of the ticket
    ticket.set({ orderId: data.id });
    //update the ticket
    await ticket.save();

    //send ticket update event //able to access this.client since base consumer has already got the client
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.price,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    msg.ack();
  }
}
