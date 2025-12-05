import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  rewardPoints: number;
  rewardCash: number;
  provider?: string;
  status: "ACTIVE" | "DISABLED";
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },

  rewardPoints: { type: Number, default: 0 },
  rewardCash: { type: Number, default: 0 },

  provider: { type: String },
  status: { type: String, enum: ["ACTIVE", "DISABLED"], default: "ACTIVE" },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);
