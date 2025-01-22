"use client";
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function Page() {

  const updatePost = async (updatedContent, hierarchicalTitle) => {
    const response = await fetch("/api/software_needed", {
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
        <RichTextEditor
        placeholder="Start typing your post..."
        onUpdate={updatePost}
        api={"/api/software_needed"}
        pageTitle={"Software Needed"}
        addAPI={"/api/software_needed/newSection"}
      />
    </div>
  );
}
