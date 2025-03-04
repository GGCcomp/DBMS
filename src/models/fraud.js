import mongoose from "mongoose";

const FraudLogSchema = new mongoose.Schema({
  userId: String,
  email: String,
  reason: { type: mongoose.Schema.Types.Mixed },
  fraudType: {
    type: String,
    enum: ["Failed Login", "Phishing", "Fake Transaction", "Multiple Accounts", "Suspicious Device"],
    required: true,
  },
  flaggedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
});

export const FraudLog = mongoose.models.FraudLog || mongoose.model("FraudLog", FraudLogSchema);

const ComplianceTicketSchema = new mongoose.Schema({
  fraudId: { type: mongoose.Schema.Types.ObjectId, ref: "FraudLog" },
  assignedTo: String, 
  status: { type: String, enum: ["Open", "Investigating", "Resolved"], default: "Open" },
  createdAt: { type: Date, default: Date.now },
});

export const ComplianceTicket = mongoose.models.ComplianceTicket || mongoose.model("ComplianceTicket", ComplianceTicketSchema);
