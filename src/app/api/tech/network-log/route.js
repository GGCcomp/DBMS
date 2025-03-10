import { NextResponse } from "next/server";
import { NetworkLog } from "@/models/tech";
import connectMongo from "@/lib/db";

export async function GET() {
  await connectMongo();
  const logs = await NetworkLog.find({});
  return NextResponse.json(logs);
}

export async function POST(req) {
  await connectMongo();
  const data = await req.json();
  const newLog = await NetworkLog.create(data);
  return NextResponse.json(newLog);
}

export async function PUT(req) {
  await connectMongo();
  const { id, ...updatedData } = await req.json();
  const updatedLog = await NetworkLog.findByIdAndUpdate(id, updatedData, { new: true });
  return NextResponse.json(updatedLog);
}

export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  await NetworkLog.findByIdAndDelete(id);
  return NextResponse.json({ message: "Log deleted successfully" });
}
