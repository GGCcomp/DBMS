import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    source: { type: String }, // e.g., Email, Chat, Phone
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" }, // Priority levels
    group: { type: String }, // Group assignment
    agent: { type: String }, // Assigned agent
    product: { type: String }, // Related product
    message: { type: String, required: true },
    reference: { type: String }, // Reference ID
    tags: { type: [String], default: [] }, // Custom tags
    status: { type: String, enum: ["Open", "In Progress", "Unresolved", "Resolved", "Closed"], default: "Open" }, // Ticket status
    lastInteraction: { type: Date, default: Date.now }, // Last interaction timestamp
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
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


const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String },
  type: { type: String, enum: ["customer", "vendor", "partner", "employee"], required: true },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Contact =  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

