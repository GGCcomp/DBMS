import { NextResponse } from "next/server";
import { ChangeLog } from "@/models/tech";
import connectMongo from "@/lib/db";

export async function GET() {
    await connectMongo();
    const logs = await ChangeLog.find();
    return NextResponse.json(logs);
}

export async function POST(req) {
    await connectMongo();
    const data = await req.json();
    const newLog = await ChangeLog.create(data);
    return NextResponse.json(newLog);
}

export async function PUT(req) {
    await connectMongo();
    const { id, ...updateData } = await req.json();
    const updatedLog = await ChangeLog.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedLog);
}

export async function DELETE(req) {
    await connectMongo();
    const { id } = await req.json();
    await ChangeLog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
}