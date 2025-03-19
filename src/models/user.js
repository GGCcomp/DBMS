import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: { type: String, enum: ["Admin", "Development", "IT", "HR", "Compliance", "CyberSecurity", "Sales", "Research"], required: true },
  role: { type: String, enum: ["admin", "Lead", "Intern"], required: true },
  permission: { type: Boolean, default: false },
  leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }],
  approvalOTP: { type: Number },
  aadhar: {type: Number, default: 0},
  panCard:{type: String, default: 0},
  mobile: Number,
  failedLoginAttempts: {type: Number, default: 0},
  approvalOTPExpires: { type: Date },
  fcmToken: { type: String, required: false }
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);


const auditLogSchema = new mongoose.Schema(
  {
    user: {
        name: { type: String, required: true },
        department: { type: String, required: true },
        role: { type: String, required: true }
    },
    action: { type: String, enum: ["Download", "Upload", "Data Update", "Logout", "Login", "PunchIn", "PunchOut"], required: true },
    details: { type: String, required: true },
    ipAddress: { type: String, required: true }
},{ timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

