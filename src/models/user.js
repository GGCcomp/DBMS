import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }] 
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);


