import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-errors";
import { createToken, validateRequest } from "../helpers/helper";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
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
    req.session = {
      jwt: createToken(user.id, user.email),
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
