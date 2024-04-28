import express from "express";
const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.status(201).send("Logged Out Successfully");
});

export { router as signOutRouter };
