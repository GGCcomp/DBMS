import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: { type: String, enum: ["Admin", "Development", "HR", "Compliance", "CyberSecurity", "Sales", "Research"], required: true },
  role: { type: String, enum: ["admin", "Lead", "Intern"], required: true },
  permission: { type: Boolean, default: false },
  leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }],
  approvalOTP: { type: Number },
  approvalOTPExpires: { type: Date },
  fcmToken: { type: String, required: false }
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);


const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["LOGIN", "LOGOUT", "DATA_UPDATE", "EXPORT", "PUNCH_IN", "PUNCH_OUT"], required: true },
    details: { type: String },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

