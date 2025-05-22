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
    status: { type: String, default: "Pending" },
}, { timestamps: true });

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

const insightSchema = new mongoose.Schema({
    employee: String,
    event: String,
}, { timestamps: { createdAt: "createdAt" } });

export const Insight = mongoose.models.Insight || mongoose.model("Insight", insightSchema);

const PolicySchema = new mongoose.Schema({
    title: String,
    link: String,
}, { timestamps: true });

export const Policy = mongoose.models.Policy || mongoose.model("Policy", PolicySchema);

const GrievanceSchema = new mongoose.Schema({
    employee: String,
    issue: String,
    status: { type: String, default: "Pending" },
}, { timestamps: true });

export const Grievance = mongoose.models.Grievance || mongoose.model("Grievance", GrievanceSchema);

const InterviewSchema = new mongoose.Schema({
    candidateName: String,
    email: String,
    phoneNo: Number,
    position: String,
    interviewDate: Date,
    interviewTime: String,
    interviewer: [String],
    interviewerEmail: [String],
    meetingLink: String,
    status: {
        type: String,
        enum: ["Scheduled", "Selected", "Rejected", "On Hold"],
        default: "Scheduled",
    },
    resumePreviewUrl: String,
    resumeDownloadUrl: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);

const employeeSchema = new mongoose.Schema({
    name: String,
    profile: {
        contact: String,
        emergency: String,
        bank: {
            branch: String,
            accountNo: String,
            IFSC: String,
            name: String
        },
    },
    employment: {
        title: String,
        department: String,
        workModel: String,
        promotions: {type: [String], default: ["N/A"]},
    },
    benefits: {type: [String], default: ["N/A"]},
    documents: [
        {
            previewUrl: String,
            downloadUrl: String,
            fileId: String, 
            name: String
        },
    ]
});

export const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);