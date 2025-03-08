import connectMongo from "@/lib/db";
import { Insight } from "@/models/hr";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectMongo();
        const insights = await Insight.find();
        
        return NextResponse.json({ insight: insights }, { status: 200 });
    } catch (err) {
        console.error("Error fetching insights:", err);
        return NextResponse.json({ message: "Failed to fetch insights", error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectMongo();
        
        const { employee, event } = await req.json();

        const insight = await Insight.create({ employee, event });

        return NextResponse.json({ message: "Insight created successfully", insight, ok: true }, { status: 201 });

    } catch (err) {
        console.error("Error creating insight:", err);
        return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
    }
}
