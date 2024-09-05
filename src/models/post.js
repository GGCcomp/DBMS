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
  }
],
});


export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export const Hr = mongoose.models.Hr || mongoose.model("Hr", PostSchema);
export const Research = mongoose.models.Research || mongoose.model("Research", PostSchema);
export const Development = mongoose.models.Development || mongoose.model("Development", PostSchema);
export const ISO = mongoose.models.ISO || mongoose.model("ISO", PostSchema);
export const Sale = mongoose.models.Sale || mongoose.model("Sale", PostSchema);
export const Marketing = mongoose.models.Marketing || mongoose.model("Marketing", PostSchema);


