import { Message } from "node-nats-streaming";
import { Consumer, Subjects } from "@adbookmyevent/common";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Listening onMessage", data);

    msg.ack();
  }
}

export default TicketCreatedConsumer;
