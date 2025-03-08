import connectMongo from "@/lib/db";
import { Policy } from "@/models/hr";
import { NextResponse } from "next/server";

// GET all policies
export async function GET() {
  await connectMongo();
  const policies = await Policy.find();
  return NextResponse.json(policies);
}

// POST: Add a new policy
export async function POST(req) {
  await connectMongo();
  const { title, link } = await req.json();
  const newPolicy = new Policy({ title, link });
  await newPolicy.save();
  return NextResponse.json(newPolicy);
}

// DELETE: Remove a policy
export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  await Policy.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted Successfully" });
}
