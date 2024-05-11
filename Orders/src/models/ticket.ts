import { OrderStatus } from "@adbookmyevent/common";
import mongoose from "mongoose";
import Order from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface TicketAttribute {
  id: string;
  title: string;
  price: number;
  // version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

export interface TicketModal extends mongoose.Model<TicketDoc> {
  build(attribute: TicketAttribute): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

//Updating to look for version to solve concurrency issues
tikcetSchema.set("versionKey", "version"); //By default its __v
tikcetSchema.plugin(updateIfCurrentPlugin);

tikcetSchema.statics.build = (attr: TicketAttribute) => {
  return new Ticket({
    _id: attr.id,
    title: attr.title,
    price: attr.price,
  });
};

tikcetSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
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
