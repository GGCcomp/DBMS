import connectMongo from "@/lib/db";
import { Interview } from "@/models/hr";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectMongo();
    const { id } = await req.json(); // Interview document ID

    const interview = await Interview.findById(id);
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Extract fileId from preview URL: https://drive.google.com/file/d/<fileId>/preview
    const fileId = interview.resumePreviewUrl?.split("/d/")[1]?.split("/")[0];

    if (!fileId) {
      return NextResponse.json({ error: "No resume file found to delete" }, { status: 400 });
    }

    // Auth for Google Drive
    const keyFile = JSON.parse(
      Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Delete the file from Drive
    await drive.files.delete({ fileId });

    // Update MongoDB
    interview.resumePreviewUrl = "";
    interview.resumeDownloadUrl = "";
    await interview.save();

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Resume deletion failed:", err);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}