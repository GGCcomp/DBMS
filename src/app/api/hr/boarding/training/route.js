import connectMongo from "@/lib/db";
import { Training } from "@/models/hr";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongo();
  const logs = await Training.find();
  return NextResponse.json(logs);
}

export async function POST(req) {
  await connectMongo();
  const { employee, course, status } = await req.json();
  const newTraining = await Training.create({ employee, course, status: status || "Ongoing" });
  return NextResponse.json(newTraining);
}
