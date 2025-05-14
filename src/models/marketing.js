import mongoose from "mongoose";

const reportSubmissionSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["releases", "deployments", "alerts", "changes"], 
    required: true 
  },
  text: String,
  previewUrls: [{ type: String }], 
  downloadUrls: [{ type: String }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const ReportSubmission = mongoose.models.ReportSubmission || mongoose.model("ReportSubmission", reportSubmissionSchema);