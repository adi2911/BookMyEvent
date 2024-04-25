import { Request, Response, NextFunction } from "express";
import { CustomErrorMessage } from "../errors/custom-error";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomErrorMessage) {
    return res.status(error.statusCode).send({
      errors: error.serializeErrors(),
    });
  }
  return res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
