import nats from "node-nats-streaming";

console.clear();
const client = nats.connect("bookmyevent", "abc", {
  url: "http://localhost:4222",
});
client.on("connect", () => {
  console.log("Publisher connected to nats");

  const message = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });
  client.publish("ticket:created", message, () => {
    console.log("Event published");
  });
});
