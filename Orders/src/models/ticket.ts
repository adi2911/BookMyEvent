import { OrderStatus } from "@adbookmyevent/common";
import mongoose from "mongoose";
import Order from "./order";

export interface TicketAttribute {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

export interface TicketModal extends mongoose.Model<TicketDoc> {
  build(attribute: TicketAttribute): TicketDoc;
}

const tikcetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

tikcetSchema.statics.build = (attr: TicketAttribute) => {
  return new Ticket({
    _id: attr.id,
    title: attr.title,
    price: attr.price,
  });
};

tikcetSchema.methods.isReserved = async function () {
  // A ticket is reserved, if it is present in order collection and status is not cancelled
  //this will be the current ticket we are looking for
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $nin: [OrderStatus.CANCELLED],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModal>("Ticket", tikcetSchema);

export default Ticket;
