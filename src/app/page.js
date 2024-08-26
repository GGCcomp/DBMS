"use client";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {
  const savePost = async (content, section) => {
    const response = await fetch("http://localhost:3000/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, section }),
    });

    if (response.ok) {
      toast.success("Post saved successfully!");
    } else {
      toast.error("Failed to save post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <RichTextEditor placeholder="Start typing your post..." onSave={savePost} />
    </div>
  );
}
