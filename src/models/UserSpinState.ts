import mongoose, { Schema, Document } from "mongoose";

export interface IUserSpinState extends Document {
  userId: string;
  dailyUsedSpins: number;
  extraSpins: number;
  lastResetAt: Date;
}

const UserSpinStateSchema = new Schema<IUserSpinState>({
  userId: { type: String, required: true, unique: true },
  dailyUsedSpins: { type: Number, default: 0 },
  extraSpins: { type: Number, default: 0 },
  lastResetAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserSpinState ||
  mongoose.model<IUserSpinState>("UserSpinState", UserSpinStateSchema);
