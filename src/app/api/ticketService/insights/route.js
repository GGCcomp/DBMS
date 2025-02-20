import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import {Ticket} from "@/models/ticket";

export async function GET() {
  try {
    await connectMongo();
    
    const totalTickets = await Ticket.countDocuments();
    const resolvedTickets = await Ticket.countDocuments({ status: "Closed" });
    const avgResolutionTime = await Ticket.aggregate([
      { $match: { closedAt: { $exists: true } } },
      { $project: { resolutionTime: { $subtract: ["$closedAt", "$createdAt"] } } },
      { $group: { _id: null, avgTime: { $avg: "$resolutionTime" } } }
    ]);

    return NextResponse.json({
      totalTickets,
      resolvedTickets,
      avgResolutionTime: avgResolutionTime[0]?.avgTime || 0
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
