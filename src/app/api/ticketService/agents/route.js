import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import {Agent} from "@/models/ticket";

export async function GET(req) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');

    const query = department ? { department } : {};
    const agents = await Agent.find(query);

    return NextResponse.json({ ok: true, agents });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}