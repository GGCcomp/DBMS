import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { FraudLog, ComplianceTicket } from "@/models/fraud";

export async function POST(req) {
  try {
    await connectMongo();
    const { userId, email, reason, fraudType } = await req.json();

    if (!userId || !email || !reason || !fraudType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["Failed Login", "Phishing", "Fake Transaction", "Multiple Accounts", "Suspicious Device"].includes(fraudType)) {
      return NextResponse.json({ error: "Invalid fraud type" }, { status: 400 });
    }

    const fraudEntry = new FraudLog({ userId, email, reason, fraudType });
    await fraudEntry.save();

    const ticket = new ComplianceTicket({ fraudId: fraudEntry._id, assignedTo: "abhi.fintech@gmail.com" });
    await ticket.save();

    return NextResponse.json({ message: "Fraud logged & ticket assigned", fraudEntry, ticket });
  } catch (error) {
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
