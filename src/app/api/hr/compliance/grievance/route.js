import connectMongo from "@/lib/db";
import { Grievance } from "@/models/hr";
import { NextResponse } from "next/server";

// GET all grievance reports
export async function GET() {
  await connectMongo();
  const reports = await Grievance.find();
  return NextResponse.json(reports);
}

// POST: Add a new grievance report
export async function POST(req) {
  await connectMongo();
  const { employee, issue, status } = await req.json();
  const newGrievance = new Grievance({ employee, issue, status });
  await newGrievance.save();
  return NextResponse.json(newGrievance);
}

// PATCH: Update grievance status
export async function PATCH(req) {
  await connectMongo();
  const { id, status } = await req.json();
  console.log(id, status);
  
  await Grievance.findByIdAndUpdate(id, { status });
  return NextResponse.json({ message: "Updated Successfully" });
}

// DELETE: Remove a grievance report
export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  await Grievance.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted Successfully" });
}
