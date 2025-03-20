import mongoose from "mongoose";

const researchRepoSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ["Centralized Workspace", "Essential Fintech Trends", "Collaboration Tools", "Funding Tracking"], 
    required: true 
  },
  text: String,
  previewUrls: [{ type: String, required: true }], 
  downloadUrls: [{ type: String, required: true }], 
  uploadedAt: { type: Date, default: Date.now }, 
});

export const ResearchRepo = mongoose.models.ResearchRepo || mongoose.model("ResearchRepo", researchRepoSchema);

const aiLearningSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Predictive Analytics & Risk Modeling", "Natural Language Processing (NLP) for Finance", "AI Fairness & Compliance"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const AiLearning = mongoose.models.AiLearning || mongoose.model("AiLearning", aiLearningSchema);

  const blockchainSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Smart Contracts & Decentralized Finance", "Central Bank Digital Currency", "Digital Identity & KYC Innovations"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const Blockchain = mongoose.models.Blockchain || mongoose.model("Blockchain", blockchainSchema);

  const financialDataSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Market Data Aggregation", "Regulatory Compliance & AML Research", "Scalable Data Processing"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const FinancialData = mongoose.models.FinancialData || mongoose.model("FinancialData", financialDataSchema);

  const simulationSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Monte Carlo & Stress Testing Models", "Derivative Pricing & Liquidity Risk"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const Simulation = mongoose.models.Simulation || mongoose.model("Simulation", simulationSchema);

  const knowledgeResearchSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Internal Research Wiki", "Live Research Seminars & Webinars", "Cross-Team Collaboration", "Innovation Challenges & Hackathons"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const KnowledgeResearch = mongoose.models.KnowledgeResearch || mongoose.model("KnowledgeResearch", knowledgeResearchSchema);


  const  regulatoryComplianceSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Automated Compliance Tracking", "Regulatory Sandboxes", "Smart Legal Contracts"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const RegulatoryCompliance = mongoose.models.RegulatoryCompliance || mongoose.model("RegulatoryCompliance", regulatoryComplianceSchema);

  const secureCollaborationSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Jupyter Notebooks & Data Science Tools", "Cloud Compute Resources", "Secure Multi-Party Computation"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const SecureCollaboration = mongoose.models.SecureCollaboration || mongoose.model("SecureCollaboration", secureCollaborationSchema);

  const prototypingSchema = new mongoose.Schema({
    fileName: { type: String, required: true }, 
    category: { 
      type: String, 
      enum: ["Low-Code & AI-Powered Prototyping", "Proof-of-Concept (PoC) Testing", "DeFi Experimentation & Financial Infrastructure"], 
      required: true 
    },
    previewUrls: [{ type: String, required: true }], 
    downloadUrls: [{ type: String, required: true }], 
    uploadedAt: { type: Date, default: Date.now }, 
  });
  
  export const Prototyping = mongoose.models.Prototyping || mongoose.model("Prototyping", prototypingSchema);