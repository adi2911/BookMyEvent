export abstract class CustomErrorMessage extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): {
    message: any;
    field?: string;
  }[];

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomErrorMessage.prototype);
  }
}
