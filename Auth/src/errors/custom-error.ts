export abstract class CustomErrorMessage extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomErrorMessage.prototype);
  }

  abstract serializeErrors(): {
    message: any;
    field?: string;
  }[];
}
