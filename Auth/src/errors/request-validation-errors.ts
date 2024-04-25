import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  public errors: ValidationError[] = [];

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
