import {
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@adbookmyevent/common";
import express, { Request, Response } from "express";
import Order from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import ticket from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
      price: order.ticket.price,
    },
  });
  res.status(204).send(order);
});

export { router as deleteOrderRouter };
