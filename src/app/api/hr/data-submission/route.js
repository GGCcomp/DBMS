import { google } from "googleapis";
import { NextResponse } from "next/server";
import { HRDataSubmission } from "@/models/hr";
import connectMongo from "@/lib/db";
import { Readable } from "stream";

export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const rawPage = parseInt(searchParams.get("page"), 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const search = searchParams.get("search") || "";
    const limit = 8;

    const query = search
      ? { user: { $regex: new RegExp(search, "i") } }
      : {};

    const total = await HRDataSubmission.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.min(page, totalPages || 1);

    const documents =
      total === 0
        ? []
        : await HRDataSubmission.find(query)
            .sort({ createdAt: -1 }) // updated to match timestamps field
            .skip((currentPage - 1) * limit)
            .limit(limit);

    return NextResponse.json(
      {
        documents,
        pagination: {
          total,
          page: currentPage,
          limit,
          totalPages,
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

export const routeSegmentConfig = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert buffer to stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const files = formData.getAll("file");
    const department = formData.get("department");
    const name = formData.get("name");
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

    const previewUrls = [];
    const downloadUrls = [];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.name}` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const bufferStream = bufferToStream(buffer);

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

    const newFileEntry = await HRDataSubmission.create({
      fileName: name,
      department,
      previewUrls,
      downloadUrls,
      user
    });

    return NextResponse.json(
      { message: "Files uploaded successfully", file: newFileEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
