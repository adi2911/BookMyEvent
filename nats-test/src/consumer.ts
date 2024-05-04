import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

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
  /*removing default behaviour to receibe event as soon as its listened, we will manually send acknowledgement
     after complete processing of that data*/
  const options = client.subscriptionOptions().setManualAckMode(true);
  const subscription = client.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data == "string") {
      console.log(
        `Received event number : ${msg.getSequence()},from channel : ${msg.getSubject()}\n with data : ${data}`
      );
    }
    msg.ack();
  });
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
