import mongoose from "mongoose";

const releaseOverviewSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { type: String, required: true },
  text: String,
  link: String,
  previewUrls: [{ type: String }], 
  downloadUrls: [{ type: String }],
  user: String
}, { timestamps: true });

export const ReleaseOverview = mongoose.models.ReleaseOverview || mongoose.model("ReleaseOverview", releaseOverviewSchema);

const repoVersionSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["versions", "branches", "repositories", "reviews", "documentation", "testingLogs", "integrations"], 
    required: true 
  },
  text: String,
  previewUrls: [{ type: String, required: true }], 
  downloadUrls: [{ type: String, required: true }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const RepoVersion = mongoose.models.RepoVersion || mongoose.model("RepoVersion", repoVersionSchema);

const securityComplianceSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["compliance", "audits", "incidents", "encryption", "accessControl"], 
    required: true 
  },
  text: String,
  previewUrls: [{ type: String, required: true }], 
  downloadUrls: [{ type: String, required: true }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const SecurityCompliance = mongoose.models.SecurityCompliance || mongoose.model("SecurityCompliance", securityComplianceSchema);

const testingQualitySchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["unitIntegrationTesting", "regressionUAT", "securityTesting", "bugTracking", "loadStressTesting"], 
    required: true 
  },
  previewUrls: [{ type: String, required: true }], 
  downloadUrls: [{ type: String, required: true }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const TestingQuality = mongoose.models.TestingQuality || mongoose.model("TestingQuality", testingQualitySchema);

const devKnowledgeBaseSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["developmentGuidelines", "documentationTrainingMaterials", "troubleshootingReviewLogs", "aiPerformanceOptimizationStrategies"], 
    required: true 
  },
  previewUrls: [{ type: String, required: true }], 
  downloadUrls: [{ type: String, required: true }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const DevKnowledgeBase = mongoose.models.DevKnowledgeBase || mongoose.model("DevKnowledgeBase", devKnowledgeBaseSchema);
