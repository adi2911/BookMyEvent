import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-errors";
import jwt from "jsonwebtoken";
const router = express.Router();

const genreateJWT = (id: string, email: string) => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY! //secret key
  );
};

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    //Check user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    //Creating new user
    const user = User.build({ email, password });
    await user.save();

    //generating jwt
    const userJWT = genreateJWT(user.id, user.email);

    //store it on the session object
    req.session = {
      ...req.session,
      jwt: userJWT,
    };

    res.status(201).send(`Use created: ${user}`);
  }
);

export { router as signUpRouter };
