import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // Removed unique constraint
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Open", "In Progress", "Unresolved" ,"Resolved", "Closed"], default: "Open" }, // Added enum for consistency
  },
  { timestamps: true }
);

export const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
