import { Publisher, Subjects } from "@adbookmyevent/common";
import { TicketCreatedEvent } from "./ticket-created-consumer";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
