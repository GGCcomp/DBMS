import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
  token: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  privateKey: String,
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

export const Invitation = mongoose.models.Invitation || mongoose.model("Invitation", InvitationSchema);