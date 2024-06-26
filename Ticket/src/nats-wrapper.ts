import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client)
      throw new Error(
        "Cannopt acces nats client before connection is successful"
      );
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise((res, rej) => {
      this.client.on("connect", () => {
        console.log("Connected to Nats");
        res();
      });
      this.client.on("error", (err) => {
        rej(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
