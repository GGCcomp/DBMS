import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // Removed unique constraint
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Open", "In Progress", "Unresolved" ,"Resolved", "Closed"], default: "Open" }, // Added enum for consistency
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

//Vendor's tickets
const vendorTicketSchema = new mongoose.Schema({
  subject: String,
  vendorEmail: String,
  status: { type: String, enum: ["open", "pending", "resolved"], default: "open" },
  messages: [
    {
      sender: String, 
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export const VendorTicket =  mongoose.models.VendorTicket || mongoose.model("VendorTicket", vendorTicketSchema);

