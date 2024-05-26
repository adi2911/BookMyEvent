import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";

import { app } from "./app";
import { TicketCreatedConsumer } from "./events/consumers/ticket-created-consumer";
import { TicketUpdatedConsumer } from "./events/consumers/ticket-updated-consumer";
import { ExpirationCompleteConsumer } from "./events/consumers/expiration-complete-consumer";
import { PaymentCreatedConsumer } from "./events/consumers/payment-created-consumer";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    //Initializing nats wrapper
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on("close", () => {
      console.log("Consumer connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //Listening to events :

    new TicketCreatedConsumer(natsWrapper.client).listen();
    new TicketUpdatedConsumer(natsWrapper.client).listen();

    new ExpirationCompleteConsumer(natsWrapper.client).listen();

    new PaymentCreatedConsumer(natsWrapper.client).listen();

    //connecting to mongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
