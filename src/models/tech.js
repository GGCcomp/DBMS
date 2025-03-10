import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    assignedTo: { type: String, default: null },
    status: { type: String, default: null },
  },
  { timestamps: true }
);


export const Asset = mongoose.models.Asset || mongoose.model("Asset", AssetSchema);

const CloudResourceSchema = new mongoose.Schema(
    {
      type: { type: String, required: true },
      usage: { type: String, required: true },
      cost: { type: String, required: true },
    },
    { timestamps: true }
  );
  
export const CloudResource = mongoose.models.CloudResource || mongoose.model("CloudResource", CloudResourceSchema);

