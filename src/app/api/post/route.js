import connectMongo from "@/lib/db";
import { Post } from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const selectedSection = searchParams.get('selectedSection');

  try {
    const posts = await Post.find();
    const sections = posts.map(sec => sec.section);
    const content = await Post.findOne({ section: selectedSection });
    const data = content ? content.content : null;

    return NextResponse.json({ section: sections, content: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}

export async function POST(request) {
  await connectMongo();

  try {
    const { content, section } = await request.json();
    console.log("Received data:", content, section);

    // Find the post by section
    const findPost = await Post.findOne({ section });

    if (findPost) {
      // If the post exists, update its content
      const updateResult = await Post.updateOne({ section }, { $push: { content } });

      // Check if the update was successful
      if (updateResult.nModified > 0) {
        return NextResponse.json({ success: true, message: "Post updated successfully" });
      } else {
        return NextResponse.json({ success: false, error: "Failed to update post" });
      }
    } else {
      // If the post doesn't exist, create a new one
      const newPost = new Post({ section, content });
      await newPost.save();
      return NextResponse.json({ success: true, post: newPost });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ success: false, error: "Failed to save post" });
  }
}

