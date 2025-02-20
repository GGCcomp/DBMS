import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import {Ticket} from "@/models/ticket";


export async function GET() {
    try {
      await connectMongo();
      
      const trendingIssues = await Ticket.aggregate([
        { $group: { _id: "$title", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
  
      return NextResponse.json({ trendingIssues });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }