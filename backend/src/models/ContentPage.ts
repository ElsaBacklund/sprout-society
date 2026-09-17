import mongoose, { Schema, Document } from "mongoose";
import { Level } from "./Level";

interface ICareInstructions {
  light: string;          // t.ex. "Indirekt solljus"
  watering: string;       // t.ex. "Vattna var 7:e dag"
  soil: string;           // t.ex. "Väldränerad jord med perlite"
  temperature: string;    // t.ex. "18–24°C"
  humidity: string;       // t.ex. "Hög luftfuktighet"
  commonProblems?: string; // vanliga problem, t.ex. gula blad
}

export interface IContentPage extends Document {
  title: string;
  plantName: string;
  category: string;        // t.ex. "Krukväxter", "Suckulenter"
  difficulty: "easy" | "medium" | "hard";
  summary: string;         // kort ingress, visas i listvyn
  imageUrl: string;
  careInstructions: ICareInstructions;
  requiredLevel: Level;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const careInstructionsSchema = new Schema<ICareInstructions>(
  {
    light: { type: String, required: true },
    watering: { type: String, required: true },
    soil: { type: String, required: true },
    temperature: { type: String, required: true },
    humidity: { type: String, required: true },
    commonProblems: { type: String }, // inte required, kan lämnas tomt
  },
  { _id: false }
);

const contentPageSchema = new Schema<IContentPage>({
  title: { type: String, required: true },
  plantName: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  summary: { type: String, required: true },
  imageUrl: { type: String, required: true },
  careInstructions: { type: careInstructionsSchema, required: true },
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