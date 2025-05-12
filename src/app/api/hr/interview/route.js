import connectMongo from "@/lib/db";
import { Interview } from "@/models/hr";
import { google } from "googleapis";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { sendInterviewEmails } from "@/lib/sendInterviewEmails";

export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 2;
    const skip = (page - 1) * limit;

    const interviews = await Interview.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interview.countDocuments();

    return NextResponse.json({ interviews, total });
  } catch (err) {
    console.error("Fetch interviews error:", err);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const file = formData.get("resume");
    const interviewer = formData.getAll("interviewer");
    const interviewerEmail = formData.getAll("interviewerEmail");

    if (!file) {
      return NextResponse.json({ error: "No resume uploaded" }, { status: 400 });
    }

    // Google Drive Auth
    const keyFile = JSON.parse(
      Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const buffer = Buffer.from(await file.arrayBuffer());
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${formData.get("candidateName")}_Resume.pdf`,
        mimeType: file.type,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: bufferStream,
      },
      fields: "id",
    });

    const fileId = driveResponse.data.id;
    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    const downloadUrl = `https://drive.google.com/uc?id=${fileId}`;

    const newInterview = await Interview.create({
      candidateName: formData.get("candidateName"),
      email: formData.get("email"),
      phoneNo: formData.get("phoneNo"),
      position: formData.get("position"),
      interviewDate: formData.get("interviewDate"),
      interviewer: interviewer,
      interviewerEmail: interviewerEmail,
      meetingLink: formData.get("meetingLink"),
      resumePreviewUrl: previewUrl,
      resumeDownloadUrl: downloadUrl,
    });

    await sendInterviewEmails({
      candidateName: formData.get("candidateName"),
      email: formData.get("email"),
      position: formData.get("position"),
      interviewDate: formData.get("interviewDate"),
      meetingLink: formData.get("meetingLink"),
      interviewer,
      interviewerEmail: interviewerEmail.flatMap((str) => str.split(",").map((e) => e.trim()))
    });

    return NextResponse.json({ message: "Interview scheduled", data: newInterview });
  } catch (err) {
    console.error("Error scheduling interview:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectMongo();
    const body = await req.json();

    const { id, status } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await Interview.findByIdAndUpdate(id, { status }, { new: true });

    return NextResponse.json({ message: "Status updated", data: updated });
  } catch (err) {
    console.error("Status update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const id = formData.get("id");
    const file = formData.get("resume");
    const interviewer = formData.getAll("interviewer");
    const interviewerEmail = formData.getAll("interviewerEmail");

    const interview = await Interview.findById(id);
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    let resumePreviewUrl = interview.resumePreviewUrl;
    let resumeDownloadUrl = interview.resumeDownloadUrl;

    // Handle file upload if new resume provided
    if (file && file.size > 0) {
      const keyFile = JSON.parse(
        Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
      );

      const auth = new google.auth.GoogleAuth({
        credentials: keyFile,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const drive = google.drive({ version: "v3", auth });

      // Remove previous file from Drive (if exists)
      const prevFileId = resumePreviewUrl?.split("/d/")[1]?.split("/")[0];
      if (prevFileId) {
        await drive.files.delete({ fileId: prevFileId });
      }

      // Upload new file
      const buffer = Buffer.from(await file.arrayBuffer());
      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);

      const driveResponse = await drive.files.create({
        requestBody: {
          name: `${formData.get("candidateName")}_Resume.pdf`,
          mimeType: file.type,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        },
        media: {
          mimeType: file.type,
          body: bufferStream,
        },
        fields: "id",
      });

      const fileId = driveResponse.data.id;
      resumePreviewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      resumeDownloadUrl = `https://drive.google.com/uc?id=${fileId}`;
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      {
        candidateName: formData.get("candidateName"),
        email: formData.get("email"),
        phoneNo: formData.get("phoneNo"),
        position: formData.get("position"),
        interviewDate: formData.get("interviewDate"),
        interviewer,
        interviewerEmail,
        meetingLink: formData.get("meetingLink"),
        resumePreviewUrl,
        resumeDownloadUrl,
      },
      { new: true }
    );

    return NextResponse.json({ message: "Interview updated", data: updatedInterview });
  } catch (err) {
    console.error("Error updating interview:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  await connectMongo();
  const { id } = await req.json();
   const interview = await Interview.findById(id);
  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  const fileId = interview.resumePreviewUrl?.split("/d/")[1]?.split("/")[0];
  if (fileId) {
    try {
      const keyFile = JSON.parse(
        Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
      );

      const auth = new google.auth.GoogleAuth({
        credentials: keyFile,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const drive = google.drive({ version: "v3", auth });
      await drive.files.delete({ fileId });
    } catch (err) {
      console.error("Drive deletion failed:", err.message);
    }
  }

  await Interview.deleteOne({ _id: id });

  return NextResponse.json({ message: "Interview and resume deleted successfully", ok: true });
}
