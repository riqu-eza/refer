import mongoose, { Schema, Document } from "mongoose";

export interface IWithdrawal extends Document {
  userId: string;
  amount: number;
  method: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  meta?: any;
  createdAt: Date;
  completedAt?: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"], default: "PENDING" },
  meta: { type: Object },

  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

export default mongoose.models.Withdrawal ||
  mongoose.model<IWithdrawal>("Withdrawal", WithdrawalSchema);
