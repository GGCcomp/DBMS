import connectMongo from "@/lib/db";
import { Employee } from "@/models/hr";
import { google } from "googleapis";
import { Readable } from "stream";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectMongo();

        // Get query parameters for filtering and pagination
        const { search, page = 1, limit = 6 } = req.nextUrl.searchParams; // Default page is 1, limit is 6
        const filters = {};

        // Apply filters if present
        if (search) {
            // Split search by comma for department and role (example: "Finance,Manager")
            const searchTerms = search.split(",");
            if (searchTerms.length === 2) {
                filters["employment.department"] = searchTerms[0].trim();
                filters["employment.title"] = searchTerms[1].trim();
            }
        }

        // Find employees based on filters and pagination
        const employees = await Employee.find(filters)
            .skip((page - 1) * limit) // Pagination: skip previous pages
            .limit(parseInt(limit)) // Limit to the specified number of employees per page
            .lean(); // Returns plain JavaScript objects (faster)

        // Get total count of employees matching the filter (for pagination)
        const totalEmployees = await Employee.countDocuments(filters);

        // Calculate total pages
        const totalPages = Math.ceil(totalEmployees / limit);

        return NextResponse.json({
            employees,
            page,
            totalPages,
            totalEmployees,
        });
    } catch (err) {
        console.error("Error fetching employees:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectMongo();

        const formData = await req.formData();
        const files = formData.getAll("resume");

        const keyFile = JSON.parse(
            Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
        );

        const auth = new google.auth.GoogleAuth({
            credentials: keyFile,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const drive = google.drive({ version: "v3", auth });
        const documentUrls = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const bufferStream = new Readable();
            bufferStream.push(buffer);
            bufferStream.push(null);

            const driveResponse = await drive.files.create({
                requestBody: {
                    name: `${formData.get("name")}_docs_${file.name}`,
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

            documentUrls.push({ previewUrl, downloadUrl });
        }

        const newEmployee = await Employee.create({
            name: formData.get("name"),
            profile: {
                contact: formData.get("contact"),
                emergency: formData.get("emergency"),
                bank: formData.get("bank"),
            },
            employment: {
                title: formData.get("title"),
                department: formData.get("department"),
                workModel: formData.get("workModel"),
                promotions: formData.getAll("promotions"),
            },
            benefits: formData.getAll("benefits"),
            documents: documentUrls,
        });

        return NextResponse.json({ message: "Employee created", data: newEmployee });
    } catch (err) {
        console.error("Error creating employee:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectMongo();
    const { id } = await req.json();
    await Employee.findOneAndDelete({ _id: id });
    return NextResponse.json({ ok: true })
}

export async function PUT(req) {
    try {
      await connectMongo();
  
      const formData = await req.formData();
      const id = formData.get("id");
  
      const files = formData.getAll("resume").filter(file => file && file.size > 0);
      const filesToRemove = JSON.parse(formData.get("filesToRemove") || "[]");
  
      const keyFile = JSON.parse(
        Buffer.from(process.env.GOOGLE_DRIVE_SERVICE_KEY, "base64").toString()
      );
  
      const auth = new google.auth.GoogleAuth({
        credentials: keyFile,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });
  
      const drive = google.drive({ version: "v3", auth });
  
      // Delete files only if there are any to remove
      if (filesToRemove.length > 0) {
        for (const fileId of filesToRemove) {
          try {
            await drive.files.delete({ fileId });
          } catch (err) {
            console.warn("Failed to delete file:", fileId, err.message);
          }
        }
      }
  
      // Upload files only if provided
      const newDocs = [];
      if (files.length > 0) {
        for (const file of files) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const bufferStream = new Readable();
          bufferStream.push(buffer);
          bufferStream.push(null);
  
          const upload = await drive.files.create({
            requestBody: {
              name: `${formData.get("name")}_docs_${file.name}`,
              mimeType: file.type,
              parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
            },
            media: {
              mimeType: file.type,
              body: bufferStream,
            },
            fields: "id",
          });
  
          const fileId = upload.data.id;
          newDocs.push({
            name: file.name,
            fileId,
            previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
            downloadUrl: `https://drive.google.com/uc?id=${fileId}`,
          });
        }
      }
  
      // Fetch employee and update docs
      const employee = await Employee.findById(id);
      const updatedDocs = employee.documents
        .filter(doc => !filesToRemove.includes(doc.fileId))
        .concat(newDocs);
  
      const updated = await Employee.findByIdAndUpdate(
        id,
        {
          name: formData.get("name"),
          profile: {
            contact: formData.get("contact"),
            emergency: formData.get("emergency"),
            bank: formData.get("bank"),
          },
          employment: {
            title: formData.get("title"),
            department: formData.get("department"),
            workModel: formData.get("workModel"),
            promotions: formData.getAll("promotions"),
          },
          benefits: formData.getAll("benefits"),
          documents: updatedDocs,
        },
        { new: true }
      );
  
      return NextResponse.json({ message: "Employee updated", data: updated });
    } catch (err) {
      console.error("Update Error:", err);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
  