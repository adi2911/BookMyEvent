import { Publisher, Subjects, TicketCreatedEvent } from "@adbookmyevent/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
