import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-errors";
import { DatabaseConnectionError } from "../errors/database-connection-errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof RequestValidationError) {
    const formattedError = error.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.path };
      }
    });
    return res.status(400).send({
      errors: formattedError,
    });
  }
  if (error instanceof DatabaseConnectionError) {
    return res.status(500).send({
      errors: [{ message: error.reason }],
    });
  }

  return res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
