import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  type: string;
  amount: number;
  currency: "FIAT" | "POINTS";
  status: "PENDING" | "SUCCESS" | "FAILED";
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ["FIAT", "POINTS"], required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  meta: { type: Schema.Types.Mixed, default: {} },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
