import { CustomErrorMessage } from "./custom-error";

export class BadRequestError extends CustomErrorMessage {
  statusCode = 502;
  constructor(public reason: string) {
    super(reason);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
