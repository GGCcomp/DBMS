import mongoose from "mongoose";

const rasaSchema = new mongoose.Schema({
  question: String,
  reason: String
}, { timestamps: true });


export const Rasa = mongoose.models.Rasa || mongoose.model("rasa", rasaSchema);