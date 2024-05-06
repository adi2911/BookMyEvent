import { Publisher, Subjects, TicketCreatedEvent } from "@adbookmyevent/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}