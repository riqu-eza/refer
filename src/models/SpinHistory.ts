// src/models/SpinHistory.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISpinHistory extends Document {
  userId: string;
  level: number;
  spinResult: string;
  pointsAwarded: number;
  createdAt: Date;
}

const SpinHistorySchema = new Schema<ISpinHistory>({
  userId: { type: String, required: true },
  level: { type: Number, required: true },
  spinResult: { type: String, required: true },
  pointsAwarded: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SpinHistory ||
  mongoose.model<ISpinHistory>("SpinHistory", SpinHistorySchema);
