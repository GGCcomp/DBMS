import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { Thread } from "@/models/thread";

export async function POST(req, { params }) {
    try {
        await connectMongo();
        const { content, author = "Anonymous" } = await req.json();
        const { id } = params;

        if (!content.trim()) {
            return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
        }

        const comment = { content, author, createdAt: new Date() };

        await Thread.findByIdAndUpdate(
            id,
            { $push: { comments: comment } },
            { new: true }
        );

        return NextResponse.json({ comment, message: "Comment added successfully" });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
export async function PUT(req, { params }) {
    try {
        await connectMongo();
        const { id } = params;
        
        await Thread.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ message: "Something Went Wrong!", error: err.message });
    }
}
