import mongoose from "mongoose";
import { OrderStatus } from "@adbookmyevent/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttribute {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attribute: OrderAttribute): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//Updating to look for version to solve concurrency issues
orderSchema.set("versionKey", "version"); //By default its __v
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attr: OrderAttribute) => {
  return new Order(attr);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export default Order;
