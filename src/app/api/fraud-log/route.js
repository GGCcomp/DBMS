import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { FraudLog, ComplianceTicket } from "@/models/fraud";

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    console.log("Received Fraud Log Payload:", body);

    const { userId, email, reason } = body;
    
    if (!userId || !email || !reason) {
      console.log("Missing Fields Error:", { userId, email, reason });
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create Fraud Log
    const fraudEntry = new FraudLog({ userId, email, reason });
    await fraudEntry.save();

    // Assign ticket to Senior Management
    const seniorManagerEmail = "abhi.fintech@gmail.com";
    const ticket = new ComplianceTicket({ fraudId: fraudEntry._id, assignedTo: seniorManagerEmail });
    await ticket.save();

    return NextResponse.json({ message: "Fraud incident logged & ticket assigned", fraudEntry, ticket });
  } catch (error) {
    console.error("Fraud Log Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}


export async function GET() {
    try {
      const tickets = await ComplianceTicket.find({ status: "Open" }).populate("fraudId");
      return NextResponse.json(tickets);
    } catch (error) {
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  }
