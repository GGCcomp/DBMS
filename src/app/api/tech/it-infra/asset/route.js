import connectMongo from "@/lib/db";
import { Asset } from "@/models/tech";
import { NextResponse } from "next/server";

// GET: Fetch all assets
export async function GET() {
  await connectMongo();
  const assets = await Asset.find();
  return NextResponse.json(assets);
}

// POST: Add a new asset
export async function POST(req) {
  await connectMongo();
  const body = await req.json();
  const asset = await Asset.create(body);
  return NextResponse.json(asset, { status: 201 });
}

// DELETE: Remove an asset by ID
export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  await Asset.findByIdAndDelete(id);
  return NextResponse.json({ message: "Asset deleted" }, { status: 200 });
}

// PUT: Update an asset
export async function PUT(req) {
  await connectMongo();
  const { id, ...updateData } = await req.json();
  const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updatedAsset);
}
