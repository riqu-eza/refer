import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  userId: string;
  fiatBalance: number;
  pointsBalance: number;
  reservedBalance: number;
  createdAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: { type: String, required: true, unique: true },
  fiatBalance: { type: Number, default: 0 },
  pointsBalance: { type: Number, default: 0 },
  reservedBalance: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Wallet ||
  mongoose.model<IWallet>("Wallet", WalletSchema);
