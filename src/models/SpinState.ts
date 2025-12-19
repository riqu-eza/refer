// src/models/SpinState.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISpinState extends Document {
  userId: string;
  spinsUsedToday: number;
  pointsEarnedToday: number;
  lastSpinDate: string; // YYYY-MM-DD
  streak: number;
  spinning?: boolean;
}

const SpinStateSchema = new Schema<ISpinState>({
  userId: { type: String, required: true, unique: true },
  spinsUsedToday: { type: Number, default: 0 },
  pointsEarnedToday: { type: Number, default: 0 },
  lastSpinDate: { type: String, required: true },
  streak: { type: Number, default: 0 },
  spinning: { type: Boolean, default: false },
});

export default mongoose.models.SpinState ||
  mongoose.model<ISpinState>("SpinState", SpinStateSchema);
