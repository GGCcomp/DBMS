import { NextResponse } from "next/server";
import sendEmail from "@/lib/email";
import connectMongo from "@/lib/db";
import {Ticket} from "@/models/ticket";

export async function GET(req) {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // Optional email filter
  
    let tickets;
    if (email) {
      tickets = await Ticket.find({ email });
    } else {
      tickets = await Ticket.find({});
    }
  
    return NextResponse.json({ success: true, tickets });
  }

export async function POST(req) {
  await connectMongo();
  const { email, subject, source,
    priority,
    group,
    agent,product,message,reference, tags } = await req.json();

  const newTicket = await Ticket.create({
    email,
    subject,
    source,
    priority,
    group,
    agent,
    product,
    message,
    reference,
    tags,
    status: "Open",
  });

  // Auto-response
  await sendEmail(email, "Ticket Received", `We received your request: "${subject}". Our team will respond soon.`);

  return NextResponse.json({ success: true, ticket: newTicket });
}


export async function PUT(req) {
    await connectMongo();;
    const { ticketId, newStatus } = await req.json();
  
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return NextResponse.json({ success: false, error: "Ticket not found" });
  
    ticket.status = newStatus;
    await ticket.save();
  
    // Send status update email
    await sendEmail(ticket.email, "Ticket Status Update", `Your ticket status is now: ${newStatus}`);
  
    return NextResponse.json({ success: true, ticket });
  }
