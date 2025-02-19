import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { Thread } from "@/models/thread";

export async function GET(req) {
    try {
        await connectMongo();
        const type = new URL(req.url).searchParams.get("type");
        const threads = await Thread.find(type ? { category: type } : {}).sort({ createdAt: -1 });
        return NextResponse.json({ threads, success: true });
    } catch (error) {
        console.error("Error fetching threads:", error);
        return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectMongo();
        const body = await req.json();
        const thread = new Thread(body);
        await thread.save();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error creating thread:", error);
        return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectMongo();
        const { id, action, userId } = await req.json();

        if (!id || !userId) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const thread = await Thread.findById(id);
        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        let updateField = {};

        if (action === "upvote") {
            if (thread.upvotedBy.includes(userId)) {
                return NextResponse.json({ error: "You already upvoted this thread" }, { status: 400 });
            }

            updateField = {
                $inc: { upvotes: 1 },
                $push: { upvotedBy: userId },
            };

            if (thread.downvotedBy.includes(userId)) {
                updateField.$inc.downvotes = -1; // Remove previous downvote
                updateField.$pull = { downvotedBy: userId };
            }
        } 
        else if (action === "downvote") {
            if (thread.downvotedBy.includes(userId)) {
                return NextResponse.json({ error: "You already downvoted this thread" }, { status: 400 });
            }

            updateField = {
                $inc: { downvotes: 1 },
                $push: { downvotedBy: userId },
            };

            if (thread.upvotedBy.includes(userId)) {
                updateField.$inc.upvotes = -1; // Remove previous upvote
                updateField.$pull = { upvotedBy: userId };
            }
        } 
        else if (action === "view") {
            updateField = { $inc: { views: 1 } };
        }

        const updatedThread = await Thread.findByIdAndUpdate(id, updateField, { new: true, runValidators: true });

        return NextResponse.json({ message: "Updated successfully", thread: updatedThread, ok: true });
    } catch (error) {
        console.error("Error updating thread:", error);
        return NextResponse.json({ error: "Failed to update thread" }, { status: 500 });
    }
}
