import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import {Contact} from "@/models/ticket";

// Connect to DB
await connectMongo();

export async function GET(req) {
    try {
      const { search } = Object.fromEntries(new URL(req.url).searchParams);
      if (!search) return NextResponse.json({ success: true, data: [] });
  
      const contacts = await Contact.find({
        $or: [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { phone: new RegExp(search, "i") },
        ],
      }).limit(10); // Limit results for quick lookup
  
      return NextResponse.json({ success: true, data: contacts });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }