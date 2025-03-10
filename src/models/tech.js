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

const ChangeLogSchema = new mongoose.Schema({
  title: String,
  details: String,
  status: String,
});

export const ChangeLog = mongoose.models.ChangeLog || mongoose.model("ChangeLog", ChangeLogSchema);


const PolicyDocSchema = new mongoose.Schema({
  title: String,
  details: String,
  status: String,
});

export const PolicyDoc = mongoose.models.PolicyDoc || mongoose.model("PolicyDoc", PolicyDocSchema);

const LogSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ["compliance", "security", "incident"] },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

