import { CustomErrorMessage } from "./custom-error";

export class NotAuthorizedError extends CustomErrorMessage {
  statusCode = 401;
  constructor() {
    super("Not Authorized User");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: "Not Authorized User",
      },
    ];
  }
}
