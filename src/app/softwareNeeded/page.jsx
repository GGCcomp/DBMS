"use client";
import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [approvals, setApprovals] = useState({
    Alok: false,
    Abhishek: false,
    Ashu: false,
  });

  useEffect(() => {
    // Fetch initial approval state from the server
    const fetchApprovals = async () => {
      try {
        const response = await fetch("/api/approval_state");
        if (response.ok) {
          const data = await response.json();
          setApprovals(data);
        } else {
          toast.error("Failed to fetch approval state");
        }
      } catch (error) {
        console.error("Error fetching approval state:", error);
        toast.error("An error occurred");
      }
    };

    fetchApprovals();
  }, []);

  const handleApprovalChange = async (user) => {
    const updatedApprovals = { ...approvals, [user]: !approvals[user] };
    setApprovals(updatedApprovals);

    // Save the updated state to the server
    try {
      const response = await fetch("/api/approval_state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedApprovals),
      });

      if (response.ok) {
        toast.success(`${user} approval state updated!`);
      } else {
        toast.error("Failed to update approval state");
      }
    } catch (error) {
      console.error("Error updating approval state:", error);
      toast.error("An error occurred");
    }
  };

  const canSubmit = Object.values(approvals).every((approved) => approved);

  const savePost = async (content, selectedTitle) => {
    if (!canSubmit) {
      toast.error("All users must approve before saving!");
      return;
    }

    const response = await fetch("/api/software_needed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, selectedTitle }),
    });

    if (response.ok) {
      toast.success("Post saved successfully!");
    } else {
      toast.error("Failed to save post");
    }
  };

  const updatePost = async (updatedContent, hierarchicalTitle) => {
    if (!canSubmit) {
      toast.error("All users must approve before updating!");
      return;
    }

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
        onSave={savePost}
        onUpdate={updatePost}
        api={"/api/software_needed"}
        pageTitle={"Software Needed"}
        addAPI={"/api/software_needed/newSection"}
        onApproval={handleApprovalChange}
        approvals={approvals}
      />
    </div>
  );
}
