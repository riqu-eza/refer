import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
  phone: string;
  email?: string;
  passwordHash: string;

  referralCode: string;
  referredBy?: string;

  sessionTokens: string[];

  createdAt: Date;
  isActivated: boolean;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },

  referralCode: { type: String, unique: true, required: true },
  referredBy: { type: String },

  sessionTokens: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
  isActivated: { type: Boolean, default: false },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
