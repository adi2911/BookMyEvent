import express, { Request, Response } from "express";
import { body } from "express-validator";
import { generateJWT, validateRequest } from "../helpers/helper";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-errors";
import { Hashing } from "../helpers/hashing";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be Valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must procive a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    // compare password if user exist
    const passwordMatch = await Hashing.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    //generating jwt
    req = generateJWT(req, existingUser);
    res
      .status(201)
      .send({ message: "Logged In successfully", user: existingUser });
  }
);

export { router as signInRouter };
