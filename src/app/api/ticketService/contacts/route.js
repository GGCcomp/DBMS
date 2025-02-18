import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import {Contact} from "@/models/ticket";

// Connect to DB
await connectMongo();

// Get All Contacts
export async function GET(req) {
  try {
    const contacts = await Contact.find({});
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create a New Contact
export async function POST(req) {
  try {
    const body = await req.json();
    await Contact.create(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


export async function PATCH(req) {
    try {
      const { id } = await req.json();
      const contact = await Contact.findById(id);
      if (!contact) return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
  
      contact.isFavorite = !contact.isFavorite;
      await contact.save();
  
      return NextResponse.json({ success: true, data: contact });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  
