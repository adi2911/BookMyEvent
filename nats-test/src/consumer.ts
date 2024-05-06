import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import TicketCreatedConsumer from "./events/ticket-created-consumer";
import TicketUpdatedConsumer from "./events/ticket-updated-consumer";

console.clear();

const client = nats.connect("bookmyevent", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Consumers connected to nats");

  client.on("close", () => {
    console.log("Consumer connection closed");
    process.exit();
  });

  new TicketCreatedConsumer(client).listen();
  new TicketUpdatedConsumer(client).listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
