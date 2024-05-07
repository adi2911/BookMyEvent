import {
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@adbookmyevent/common";
import express, { Request, Response } from "express";
import Order from "../models/order";

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
  res.status(204).send(order);
});

export { router as deleteOrderRouter };
