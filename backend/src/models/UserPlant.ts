import mongoose, { Schema, Document, Types } from "mongoose";

interface ICareTrack {
  intervalDays: number;   // hur ofta växten behöver "detta" (i dagar)
  lastDoneAt?: Date;      // senast användaren markerade det som gjort
}

const careTrackSchema = new Schema<ICareTrack>(
  {
    intervalDays: { type: Number, required: true, min: 1 },
    lastDoneAt: { type: Date },
  },
  { _id: false }   // ingen egen id på delschemat, den bor inuti UserPlant
);

// Huvudinterface: en växt i en användares samling
export interface IUserPlant extends Document {
  user: Types.ObjectId;          // vem äger växten
  contentPage: Types.ObjectId;   // vilken växt-typ 
  nickname?: string;             // smeknamn, t.ex. "Bob"
  addedAt: Date;

  watering: ICareTrack;          // alla har vattning aktivt
  sunlight?: ICareTrack;         // bara Bloomer och uppåt
  nutrition?: ICareTrack;        // bara Green Thumb
}

const userPlantSchema = new Schema<IUserPlant>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  contentPage: { type: Schema.Types.ObjectId, ref: "ContentPage", required: true },
  nickname: { type: String },
  addedAt: { type: Date, default: Date.now },

  watering: { type: careTrackSchema, required: true },
  sunlight: { type: careTrackSchema },
  nutrition: { type: careTrackSchema },
});

export const UserPlant = mongoose.model<IUserPlant>("UserPlant", userPlantSchema);