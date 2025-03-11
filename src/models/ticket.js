import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: { type: String, enum: ["Development", "IT",  "Compliance", "CyberSecurity", "Sales", "Research"], required: true },
  ticketsResolved: { type: Number, default: 0 },
  ticketsAssigned: { type: Number, default: 0 },
});

export const Agent = mongoose.models.Agent || mongoose.model("Agent", agentSchema);

const ticketSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    source: { type: String }, // e.g., Email, Chat, Phone
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" }, // Priority levels
    group: { type: String }, // Group assignment
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" }, // Assigned agent (reference)
    department: { type: String, enum: ["Development", "IT",  "Compliance", "CyberSecurity", "Sales", "Research"], required: true },
    product: { type: String }, // Related product
    message: { type: String, required: true },
    reference: { type: String }, // Reference ID
    tags: { type: [String], default: [] }, // Custom tags
    status: { 
      type: String, 
      enum: ["Open", "In Progress", "Unresolved", "Resolved", "Closed"], 
      default: "Open" 
    }, // Ticket status
    lastInteraction: { type: Date, default: Date.now }, // Last interaction timestamp
    closedAt: { type: Date }, // Timestamp when ticket was closed
    customerFeedback: { type: Number, min: 1, max: 5 }, // Customer rating (1-5)
    slaBreached: { type: Boolean, default: false }, // SLA Compliance Tracking
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Middleware to update lastInteraction on any update
ticketSchema.pre("save", function (next) {
  this.lastInteraction = new Date();
  next();
});

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

