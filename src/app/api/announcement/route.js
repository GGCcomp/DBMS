import connectMongo from "@/lib/db";
import { Announcement } from "@/models/announcement";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      // Ensure you connect to the database
      await connectMongo();
  
      // Fetch announcements and use `.lean()` to get plain JavaScript objects
      const announcements = await Announcement.find({}).lean();
  
      // Return the announcements as a JSON response
      return NextResponse.json({ announcement: announcements });
    } catch (error) {
      console.error('Error finding announcement:', error);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }
  }

export async function POST(request) {
    try {
        const payload = await request.json();
        await connectMongo();
        let announcement = new Announcement(payload);
        await announcement.save();
        return NextResponse.json({ message: "Annoucement Created!", announcement }, { status: 201 })
    } catch (err) {
        console.error("Error creating announcement:", error);
        return NextResponse.json(
            { message: "Failed to create announcement", error: error.message },
            { status: 500 }
        );
    }
}