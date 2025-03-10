import connectMongo from "@/lib/db";
import { CloudResource } from "@/models/tech";
import { NextResponse } from "next/server";

// GET: Fetch all cloud resources
export async function GET() {
  await connectMongo();
  const cloudResources = await CloudResource.find();
  return NextResponse.json(cloudResources);
}

// POST: Add a new cloud resource
export async function POST(req) {
  await connectMongo();
  const body = await req.json();
  const cloudResource = await CloudResource.create(body);
  return NextResponse.json(cloudResource, { status: 201 });
}

// DELETE: Remove a cloud resource by ID
export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  await CloudResource.findByIdAndDelete(id);
  return NextResponse.json({ message: "Cloud resource deleted" }, { status: 200 });
}

// PUT: Update a cloud resource
export async function PUT(req) {
  await connectMongo();
  const { id, ...updateData } = await req.json();
  const updatedResource = await CloudResource.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updatedResource);
}
