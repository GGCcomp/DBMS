import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import {Agent} from "@/models/ticket";

export async function GET() {
    try {
      await connectMongo();
      const agents = await Agent.find().select("name ticketsResolved ticketsAssigned");
  
      return NextResponse.json({  agents });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }