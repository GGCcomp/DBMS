import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: Date, required: true },
  creator: { type: String, default: false },
}, { timestamps: true });

export const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);


const LeaveSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  role: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  name: String,
  email: String, 
  approval: { 
    type: String, 
    enum: ["requested", "approved", "rejected"], 
    default: "requested"
  }
});

export const Leave = mongoose.models.Leave || mongoose.model("Leave", LeaveSchema);