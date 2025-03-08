import mongoose from "mongoose";

const OnboardingSchema = new mongoose.Schema({
    fileName: String,
    previewUrls: [String],
    downloadUrls: [String],
    uploadedAt: { type: Date, default: Date.now }
});

export const Onboarding = mongoose.models.Onboarding || mongoose.model("Onboarding", OnboardingSchema);

const TrainingSchema = new mongoose.Schema({
    employee: String,
    course: String,
    status: String,
});

export const Training = mongoose.models.Training || mongoose.model("Training", TrainingSchema);

const OffboardingSchema = new mongoose.Schema({
    employee: String,
    email: { type: String, unique: true },
    department: String,
    fileName: String,
    previewUrls: [String],
    downloadUrls: [String],
    uploadedAt: { type: Date, default: Date.now }
});

export const Offboarding = mongoose.models.Offboarding || mongoose.model("Offboarding", OffboardingSchema);
