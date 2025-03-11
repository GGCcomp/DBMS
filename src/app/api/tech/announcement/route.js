import { NextResponse } from "next/server";
import { ITAnnouncement } from "@/models/tech";
import connectMongo from "@/lib/db";

export async function GET() {
    try {
      await connectMongo();
  
      const announcements = await ITAnnouncement.find().sort({ createdAt: -1 });
  
      return NextResponse.json({ ok: true, announcements });
    } catch (err) {
      console.error("Error fetching announcements:", err);
  
      return NextResponse.json(
        { ok: false, message: "Something Went Wrong!", error: err.message },
        { status: 500 }
      );
    }
  }
  

export async function POST(req) {
    try {
        await connectMongo();

        const { payload } = await req.json(); 
        if (!payload || !payload.title || !payload.details || !payload.type) {
            return NextResponse.json({ ok: false, message: "All fields are required!" }, { status: 400 });
        }

        await ITAnnouncement.create(payload);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Error saving announcement:", err);
        return NextResponse.json({ message: "Something Went Wrong!", error: err.message }, { status: 500 });
    }
}
