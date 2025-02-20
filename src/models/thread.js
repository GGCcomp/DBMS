import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  userId: String,
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: String,
  category: { type: String, enum: ["FAQs", "Guides", "Policies","Survey"], required: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      author: String,
      content: String,
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      upvotedBy: [{ type: String }],
      downvotedBy: [{ type: String }],
      createdAt: { type: Date, default: Date.now }
    },
  ],
  viewedBy: [{ type: String }]
});

export const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);
