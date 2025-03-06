import mongoose from "mongoose";

const OnboardingSchema = new mongoose.Schema({
    fileName: String,
    previewUrl: String,
    downloadUrl: String,
    uploadedAt: { type: Date, default: Date.now },
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
    status: String,
});
export const Offboarding = mongoose.models.Offboarding || mongoose.model("Offboarding", OffboardingSchema);
