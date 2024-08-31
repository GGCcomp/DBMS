import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  section: [
  { title: String, 
    content: { type: [String], default: [] },
    subSection: [{
      title: String,
      content: { type: [String], default: [] },
      subSection1: [{
        title: String,
        content: { type: [String], default: [] },
        subSection2: [{
          title: String,
          content: { type: [String], default: [] } 
        }]
      }]
    }]
  }],
});


export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);


