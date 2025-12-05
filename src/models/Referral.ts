import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
  referrerId: string;
  refereeId: string;
  code: string;
  rewardGiven: boolean;
}

const ReferralSchema = new Schema<IReferral>({
  referrerId: { type: String, required: true },
  refereeId: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  rewardGiven: { type: Boolean, default: false }
});

export default mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema);
