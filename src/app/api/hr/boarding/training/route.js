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

export async function PATCH(req) {
  await connectToDB();
  const { id, status } = await req.json();
  await Training.findByIdAndUpdate(id, { status });
  return NextResponse.json({ message: "Updated Successfully" });
}