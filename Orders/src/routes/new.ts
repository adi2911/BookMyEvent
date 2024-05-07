import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@adbookmyevent/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import Ticket from "../models/ticket";
import Order from "../models/order";

const router = express.Router();
export const EXPIRATION_WINDOW = 15 * 60;
router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TickedId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //Find ticket in database that user is trying to purchase
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    //Check If ticket is not reserved already by different user

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //Calculate expiration date for locking a ticket's order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW); //15 seconds expiration

    //build the order and save to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish order created event

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
