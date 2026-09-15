import mongoose, { Schema, Document, Types } from "mongoose";
import { Level } from "./Level";

export interface IReceipt extends Document {
  user: Types.ObjectId;
  level: Level;
  amount: number;
  transactionId: string;
  createdAt: Date;
}

const receiptSchema = new Schema<IReceipt>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: String, enum: Object.values(Level), required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Receipt = mongoose.model<IReceipt>("Receipt", receiptSchema);
