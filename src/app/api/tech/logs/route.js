import { NextResponse } from "next/server";
import { Log } from "@/models/tech";
import connectMongo from "@/lib/db";

export async function GET() {
    try {
        await connectMongo();
        const logs = await Log.find();
        return NextResponse.json({ success: true, logs }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await connectMongo();
        const { type, message } = await req.json();
        if (!type || !message) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const newLog = await Log.create({ type, message });
        return NextResponse.json({ success: true, log: newLog }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}