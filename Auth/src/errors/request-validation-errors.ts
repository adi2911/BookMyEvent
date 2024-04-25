import { ValidationError } from "express-validator";
import { CustomErrorMessage } from "./custom-error";

export class RequestValidationError extends CustomErrorMessage {
  public errors: ValidationError[] = [];
  statusCode = 400;

  constructor(errors: ValidationError[]) {
    super("Invalid request parameters");
    this.errors = errors;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.type === "field" ? err.path : "",
      };
    });
  }
}
