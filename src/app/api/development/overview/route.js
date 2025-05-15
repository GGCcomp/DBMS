import { google } from "googleapis";
import { NextResponse } from "next/server";
import { ReleaseOverview } from "@/models/development";
import connectMongo from "@/lib/db";
import { Readable } from "stream";

export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 8; // fixed at 8 per page

    const total = await ReleaseOverview.countDocuments();
    const documents = await ReleaseOverview.find()
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        documents,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to retrieve documents" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const files = formData.getAll("file");
    const category = formData.get("category");
    const text = formData.get("text");
    const name = formData.get("name");
    const link = formData.get("link");
    const user = formData.get("user");

    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];

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

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.name}` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);

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

    const newFileEntry = await ReleaseOverview.create({
      fileName: name,
      category,
      text,
      link,
      previewUrls,
      downloadUrls,
      user
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
