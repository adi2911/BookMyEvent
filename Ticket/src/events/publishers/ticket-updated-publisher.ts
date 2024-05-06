import { Publisher, Subjects, TicketUpdatedEvent } from "@adbookmyevent/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
