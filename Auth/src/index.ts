import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signUpRouter } from "./routes/sign-up";
import { signOutRouter } from "./routes/sign-out";
import { errorHandler } from "./middleware/error-handler";
import { NotFoundError } from "./errors/not-found-errors";
import "express-async-errors";
import mongoose from "mongoose";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use(errorHandler);

app.get("*", async () => {
  throw new NotFoundError();
});

const startUp = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-service:27017/auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

app.listen(3000, () => {
  console.log("Listening Auth Service on 3000");
});
startUp();
