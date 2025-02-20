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
        const { threadId, commentId, action, userId } = await req.json();
        console.log(threadId, commentId, action, userId);
        

        if (!threadId || !commentId || !userId) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        const comment = thread.comments.find(c => c._id.toString() === commentId);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        let updateQuery = {};

        if (action === "upvote") {
            if (comment.upvotedBy.includes(userId)) {
                return NextResponse.json({ error: "You already upvoted this comment" }, { status: 400 });
            }

            updateQuery = {
                $inc: { "comments.$.upvotes": 1 },
                $push: { "comments.$.upvotedBy": userId }
            };

            if (comment.downvotedBy.includes(userId)) {
                updateQuery.$inc["comments.$.downvotes"] = -1;
                updateQuery.$pull = { "comments.$.downvotedBy": userId };
            }
        } 
        else if (action === "downvote") {
            if (comment.downvotedBy.includes(userId)) {
                return NextResponse.json({ error: "You already downvoted this comment" }, { status: 400 });
            }

            updateQuery = {
                $inc: { "comments.$.downvotes": 1 },
                $push: { "comments.$.downvotedBy": userId }
            };

            if (comment.upvotedBy.includes(userId)) {
                updateQuery.$inc["comments.$.upvotes"] = -1;
                updateQuery.$pull = { "comments.$.upvotedBy": userId };
            }
        }

        const updatedThread = await Thread.findOneAndUpdate(
            { _id: threadId, "comments._id": commentId },
            updateQuery,
            { new: true, runValidators: true }
        );

        return NextResponse.json({ message: "Updated successfully", thread: updatedThread, ok: true });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }
}

