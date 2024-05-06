import { Message } from "node-nats-streaming";
import { Consumer, Subjects, TicketUpdatedEvent } from "@adbookmyevent/common";

class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = "payments-service";

  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {
    console.log("Listening onMessage", data);

    msg.ack();
  }
}

export default TicketUpdatedConsumer;
