import mongoose, { Schema, Document } from "mongoose";
import { Level } from "./Level";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  level: Level;
  isAdmin: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  level: {
    type: String,
    enum: Object.values(Level),
    default: Level.GRUNDPAKET,
  },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", userSchema);
