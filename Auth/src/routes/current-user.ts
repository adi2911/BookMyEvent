import express from "express";
import jwt from "jsonwebtoken";
import { Cursor } from "mongoose";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  //If jwt token  is not set
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  //check if jwt is valid
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
