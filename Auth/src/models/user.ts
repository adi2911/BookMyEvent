import mongoose from "mongoose";
import { Hashing } from "../helpers/hashing";

//type for User model's build method
export type UserAttributes = {
  email: string;
  password: string;
};

//interface to descibe User document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

//interface to describe User model
export interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttributes: UserAttributes): UserDoc;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPass = await Hashing.toHash(this.get("password"));
    this.set("password", hashedPass);
  }
  done();
});

// adding a build function as static property that can be access directly using User model
userSchema.statics.build = (userAttributes: UserAttributes) => {
  return new User(userAttributes);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
