import mongoose, { Schema, Document } from "mongoose";

export interface ISpin extends Document {
  userId: string;
  rewardType: "NONE" | "POINTS" | "CASH" | "COUPON";
  rewardValue: number;
  configId?: string;
  rawResult?: any;
  createdAt: Date;
}

const SpinSchema = new Schema<ISpin>({
  userId: { type: String, required: true },
  rewardType: { type: String, enum: ["NONE", "POINTS", "CASH", "COUPON"], default: "NONE" },
  rewardValue: { type: Number, default: 0 },
  configId: { type: String },
  rawResult: { type: Object },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Spin ||
  mongoose.model<ISpin>("Spin", SpinSchema);
