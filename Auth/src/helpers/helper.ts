import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";
import jwt from "jsonwebtoken";
import { UserDoc, UserModel } from "../models/user";
import { NotAuthorizedError } from "../errors/not-authorized-errors";

export interface UserPayload {
  id: string;
  email: string;
}

//Adding currentUser property to existing Request interface of express
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};

export const createToken = (id: string, email: string) => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY! //secret key
  );
};

//adding a currentUser property to Request type and req object
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //If jwt token  is not set
  if (!req.session?.jwt) {
    return next();
  }

  //check if jwt is valid
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    req.currentUser = undefined;
  }
  next();
};

// verifying if user exist and should match
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) throw new NotAuthorizedError();
  next();
};
