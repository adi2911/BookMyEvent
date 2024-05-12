import mongoose from "mongoose";
import { OrderStatus } from "@adbookmyevent/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttribute {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  price: number;
  userId: string;
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
    price: {
      type: Number,
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
  return new Order({
    ...attr,
    _id: attr.id,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export default Order;
