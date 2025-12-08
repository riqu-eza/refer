import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  type: string;
  amount: number;
  currency: "FIAT" | "POINTS";
  status: "PENDING" | "SUCCESS" | "FAILED";

  merchantRequestID?: string;
  checkoutRequestID?: string;

  receiptNumber?: string;
  paidPhoneNumber?: string;
  paidAt?: Date;

  meta?: Record<string, unknown>;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ["FIAT", "POINTS"], required: true },

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },

  merchantRequestID: { type: String, index: true },
  checkoutRequestID: { type: String, index: true },

  receiptNumber: String,
  paidPhoneNumber: String,
  paidAt: Date,

  meta: { type: Schema.Types.Mixed, default: {} },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
