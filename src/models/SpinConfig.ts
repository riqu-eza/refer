import mongoose, { Schema, Document } from "mongoose";

export interface ISpinConfig extends Document {
  name: string;
  active: boolean;
  prizes: any[];
  budget: number;
  resetsAt?: Date;
}

const SpinConfigSchema = new Schema<ISpinConfig>({
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  prizes: { type: Array, default: [] },
  budget: { type: Number, default: 0 },
  resetsAt: { type: Date }
});

export default mongoose.models.SpinConfig ||
  mongoose.model<ISpinConfig>("SpinConfig", SpinConfigSchema);
