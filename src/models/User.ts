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
  referralLevels: {
    tier1: string[]; // direct referrals
    tier2: string[];
    tier3: string[];
  };

  xp: number;
  level: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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
  referralLevels: {
    tier1: { type: [String], default: [] },
    tier2: { type: [String], default: [] },
    tier3: { type: [String], default: [] },
  },

  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
