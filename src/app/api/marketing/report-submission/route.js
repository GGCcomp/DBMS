import { google } from "googleapis";
import { NextResponse } from "next/server";
import { ReportSubmission } from "@/models/marketing";
import connectMongo from "@/lib/db";
import { Readable } from "stream";

export async function GET() {
    try {
        await connectMongo();

        const documents = await ReportSubmission.find();

        const categorizedDocuments = {
            social_media: [],
            advertisement: []
        };

        documents.forEach((doc) => {
            categorizedDocuments[doc.category].push(doc);
        });

        return NextResponse.json({ documents: categorizedDocuments }, { status: 200 });

    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ error: "Failed to retrieve documents" }, { status: 500 });
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

        const allowedMimeTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
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

        const newFileEntry = await ReportSubmission.create({
            fileName: name,
            category,
            text,
            previewUrls,
            downloadUrls,
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
