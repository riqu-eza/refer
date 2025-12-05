import mongoose, { Schema, Document } from "mongoose";

export interface IUserTask extends Document {
  userId: string;
  taskId: string;
  status: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";
  proof?: string;
  submittedAt?: Date;
  verifiedAt?: Date;
}

const UserTaskSchema = new Schema<IUserTask>({
  userId: { type: String, required: true },
  taskId: { type: String, required: true },

  status: { type: String, enum: ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"], default: "PENDING" },
  proof: { type: String },
  submittedAt: { type: Date },
  verifiedAt: { type: Date }
});

export default mongoose.models.UserTask ||
  mongoose.model<IUserTask>("UserTask", UserTaskSchema);
