import connectMongo from "@/lib/db";
import { Onboarding } from "@/models/hr";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";


export async function POST(req) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer into a readable stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null); // Indicate end of stream

    // Authenticate Google Drive API
    const keyFile = JSON.parse(
      Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Upload file to Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Set your Drive folder ID in .env
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

    // Save file details in MongoDB
    const newFile = await Onboarding.create({
      fileName: formData.get("name"), // Fix: Access formData correctly
      previewUrl: previewUrl,
      downloadUrl: downloadUrl,
      uploadedAt: new Date(),
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}


  export async function GET() {
    await connectMongo();
    const docs = await Onboarding.find();
    return NextResponse.json(docs);
  }
