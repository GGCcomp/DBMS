"use client";
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

  const updatePost = async (updatedContent, hierarchicalTitle) => {
    const response = await fetch("/api/iso", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedContent, hierarchicalTitle }),
    });
  
    if (response.ok) {
      toast.success("Post updated successfully!");
    } else {
      toast.error("Failed to update post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <RichTextEditor placeholder="Start typing your post..." onUpdate={updatePost} api={'/api/iso'} pageTitle={'ISO Section'} addAPI={'/api/iso/newSection'} />
    </div>
  );
}
