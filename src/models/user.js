import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: {type: String, enum: ["Admin", "Development", "Compliance", "CyberSecurity","Marketing&Sales"], required: true},
  role: { type: String, enum: ["Admin", "Lead", "Intern"], required: true },
  leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }],
  fcmToken: { type: String, required: false }
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);


