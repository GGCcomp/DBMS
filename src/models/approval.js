import mongoose from 'mongoose';

const ApprovalSchema = new mongoose.Schema({
  content: { type: [String], default: [] },
  title: String,
  url: String,
  email: String,
  role: { type: String, required: true },
  name: { type: String, default: false },
  approval: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending"
  }
}, { timestamps: true });

export const Approval = mongoose.models.Approval || mongoose.model("Approval", ApprovalSchema);