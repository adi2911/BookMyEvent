import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";
import jwt from "jsonwebtoken";
import { UserDoc, UserModel } from "../models/user";

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

const createToken = (id: string, email: string) => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY! //secret key
  );
};

export const generateJWT = (req: Request, user: UserDoc) => {
  const userJWT = createToken(user.id, user.email);

  //store it on the session object
  req.session = {
    ...req.session,
    jwt: userJWT,
  };
  return req;
};
