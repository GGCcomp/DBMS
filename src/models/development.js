import mongoose from "mongoose";

const apiRepoSchema = new mongoose.Schema({
    documentation: { type: [String], default: [] },
    versionControl: { type: [String], default: [] },
    testingLogs: { type: [String], default: [] },
    integrations: { type: [String], default: [] },
});

export const ApiRepo =  mongoose.models.ApiRepo || mongoose.model('ApiRepo', apiRepoSchema);