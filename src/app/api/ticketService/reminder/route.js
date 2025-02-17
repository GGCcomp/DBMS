import { NextResponse } from "next/server";
import sendEmail from "@/lib/email";
import connectMongo from "@/lib/db";
import {Ticket} from "@/models/ticket";

const SUPPORT_TEAM_EMAILS = ["support@gmail.com", "admin@gmail.com"]; 

export async function GET() {
  await connectMongo();
  const now = new Date();
  const twoDaysLeft = new Date();
  twoDaysLeft.setDate(now.getDate() - 1); // Ticket created 2 days ago
  const oneDayLeft = new Date();
  oneDayLeft.setDate(now.getDate() - 2); // Ticket created 3 days ago (last warning)

  // Find tickets that are still open and reaching the deadline
  const pendingTickets = await Ticket.find({
    status: { $nin: ["Resolved", "Closed"] }, // Exclude resolved/closed tickets
    createdAt: { $gte: oneDayLeft, $lte: twoDaysLeft }, // 2-3 days old tickets
  });

  if (pendingTickets.length > 0) {
    // Notify employees about pending tickets
    const ticketDetails = pendingTickets
      .map((t) => `- ${t.subject} (Created: ${t.createdAt.toDateString()})`)
      .join("\n");

    for (const email of SUPPORT_TEAM_EMAILS) {
      await sendEmail(
        email,
        "🚨 Pending Tickets Reminder",
        `The following tickets are approaching the deadline:\n\n${ticketDetails}\n\nPlease take action.`
      );
    }
  }

  return NextResponse.json({ success: true, tickets: pendingTickets });
}
