import { NextResponse } from "next/server";
import { PolicyDoc } from "@/models/tech";
import connectMongo from "@/lib/db";

export async function GET() {
    await connectMongo();
    const policies = await PolicyDoc.find();
    return NextResponse.json(policies);
}

export async function POST(req) {
    await connectMongo();
    const data = await req.json();
    const newPolicy = await PolicyDoc.create(data);
    return NextResponse.json(newPolicy);
}

export async function PUT(req) {
    await connectMongo();
    const { id, ...updateData } = await req.json();
    const updatedPolicy = await PolicyDoc.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedPolicy);
}

export async function DELETE(req) {
    await connectMongo();
    const { id } = await req.json();
    await PolicyDoc.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
}
