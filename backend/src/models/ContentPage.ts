import mongoose, { Schema, Document } from "mongoose";
import { Level } from "./Level";

// OBS: Detta schema äger Linn (innehåll & admin).
// Det ligger med här redan nu så att den som bygger nivåval/betalning kan referera till det.

export interface IContentPage extends Document {
  title: string;
  body: string;
  requiredLevel: Level;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const contentPageSchema = new Schema<IContentPage>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  requiredLevel: {
    type: String,
    enum: Object.values(Level),
    default: Level.GRUNDPAKET,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ContentPage = mongoose.model<IContentPage>(
  "ContentPage",
  contentPageSchema
);
