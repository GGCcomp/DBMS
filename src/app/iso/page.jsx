"use client";
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {
  const savePost = async (content, selectedTitle) => {
    const response = await fetch("/api/iso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, selectedTitle })
    });

    if (response.ok) {
      toast.success("Post saved successfully!");
    } else {
      toast.error("Failed to save post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <RichTextEditor placeholder="Start typing your post..." onSave={savePost} api={'/api/iso'} pageTitle={'ISO Section'} addAPI={'/api/iso/newSection'} />
    </div>
  );
}
