import connectMongo from "@/lib/db";
import { Offboarding } from "@/models/hr";
import { NextResponse } from "next/server";

export async function GET() {
    await connectMongo();
    const records = await Offboarding.find();
    return NextResponse.json(records);
  }
  
  export async function POST(req) {
    await connectMongo();
    const { employee, status } = await req.json();
    const newRecord = await Offboarding.create({ employee, status: status || "Pending Approval" });
    return NextResponse.json(newRecord);
  }