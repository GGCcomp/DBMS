import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  section: { type: String, required: true },
  content: { type: [String], default: [] }
});


export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);


