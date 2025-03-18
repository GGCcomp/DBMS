import mongoose from "mongoose";

const apiRepoSchema = new mongoose.Schema({
    documentation: { type: [String], default: [] },
    versionControl: { type: [String], default: [] },
    testingLogs: { type: [String], default: [] },
    integrations: { type: [String], default: [] },
});

export const ApiRepo =  mongoose.models.ApiRepo || mongoose.model('ApiRepo', apiRepoSchema);


const releaseOverviewSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["releases", "deployments", "alerts", "changes"], 
    required: true 
  },
  text: String,
  previewUrls: [{ type: String, required: true }], 
  downloadUrls: [{ type: String, required: true }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const ReleaseOverview = mongoose.models.ReleaseOverview || mongoose.model("ReleaseOverview", releaseOverviewSchema);
