import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId?: string;
  entity: string;
  entityId: string;
  action: string;
  details?: any;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: String },
  entity: { type: String, required: true },
  entityId: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: Object },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
