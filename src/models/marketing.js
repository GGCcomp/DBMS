import mongoose from "mongoose";

const reportSubmissionSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { type: String, required: true },
  text: String,
  previewUrls: [{ type: String }], 
  downloadUrls: [{ type: String }],
  user: String
}, { timestamps: true });

export const ReportSubmission = mongoose.models.ReportSubmission || mongoose.model("ReportSubmission", reportSubmissionSchema);