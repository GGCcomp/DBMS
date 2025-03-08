import connectMongo from "@/lib/db";
import { Onboarding } from "@/models/hr";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function GET() {
  await connectMongo();
  const docs = await Onboarding.find();
  return NextResponse.json(docs);
}

export async function POST(req) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const files = formData.getAll("file"); // Get multiple files

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Authenticate Google Drive API
    const keyFile = JSON.parse(
      Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    let previewUrls = [];
    let downloadUrls = [];

    // Process each file
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);

      // Upload to Google Drive
      const driveResponse = await drive.files.create({
        requestBody: {
          name: file.name,
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
      previewUrls.push(`https://drive.google.com/file/d/${fileId}/preview`);
      downloadUrls.push(`https://drive.google.com/uc?id=${fileId}`);
    }

    // Save all files in a **single MongoDB document**
    const newFileEntry = await Onboarding.create({
      fileName: formData.get("name"), // Single name (if applicable)
      previewUrls: previewUrls,
      downloadUrls: downloadUrls,
      uploadedAt: new Date(),
    });

    return NextResponse.json({
      message: "Files uploaded successfully",
      file: newFileEntry,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

