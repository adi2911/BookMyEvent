import nats, { Stan } from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-creater-publisher";
import { TicketCreatedEvent } from "./events/ticket-created-consumer";

console.clear();
const client = nats.connect("bookmyevent", "abc", {
  url: "http://localhost:4222",
});
client.on("connect", async () => {
  console.log("Publisher connected to nats");

  const message: TicketCreatedEvent["data"] = {
    id: "123",
    title: "concert",
    price: 20,
    userId: "test-id",
  };

  const ticketCreatedPublished = new TicketCreatedPublisher(client);

  await ticketCreatedPublished.publish(message);
});
