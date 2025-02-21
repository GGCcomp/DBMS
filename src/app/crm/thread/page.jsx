"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { ThumbsUp, ThumbsDown, Eye, PlusCircle, MessageSquare } from "lucide-react";
import ThreadModal from "@/components/ThreadModal";
import { Toaster, toast } from 'sonner';

export default function Page() {
  const [threads, setThreads] = useState([]);
  const [threadModal, setThreadModal] = useState(false);
  const [threadModalData, setThreadModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newThread, setNewThread] = useState({ userId: "", title: "", content: "", author: "", category: "FAQs" });
  const [activeThread, setActiveThread] = useState(null);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();


  useEffect(() => {
    fetch("/api/thread")
      .then((res) => res.json())
      .then((data) => setThreads(data.threads || []));
  }, []);

  useEffect(() => {
    if (threadModal && threadModalData?._id) {
      const updateView = async () => {
        await fetch(`/api/thread/${threadModalData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.email })
        });
      };
      updateView();
    }
  }, [threadModal, threadModalData]);

  useEffect(() => {
    if (session) {
      setNewThread((prev) => ({
        ...prev,
        author: session.user.name, 
        userId: session.user.email, 
      }));
    }
  }, [session]);


  const handleVote = async (threadId, commentId, action) => {
    const userId = session.user.email;

    const res = await fetch("/api/thread", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, commentId, action, userId })
    });

    const data = await res.json();

    if (res.ok) {
      setThreads((prev) =>
        prev.map((thread) =>
          thread._id === threadId
            ? {
              ...thread,
              comments: thread.comments.map((comment) =>
                comment._id === commentId ? data.updatedComment : comment
              ),
            }
            : thread
        )
      );
      toast.success("Voted!");
    } else {
      console.error("Error:", data.error);
      toast.error(data.error);
    }
  };


  const handleAddThread = async () => {
    console.log(newThread.title, newThread.content, newThread.author, newThread.userId);

    if (!newThread.title || !newThread.content || !newThread.author) return;
    const res = await fetch("/api/thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newThread),
    });
    if (res.ok) {
      const { success } = await res.json();
      if (success) {
        setThreads([{ ...newThread, _id: Date.now(), upvotes: 0, downvotes: 0, views: 0, comments: [] }, ...threads]);
        setShowModal(false);
        setNewThread({ title: "", content: "", author: "", category: "Forum" });
      }
    }
  };

  const handleAddComment = async (threadId) => {
    if (!newComment) return;
    const res = await fetch(`/api/thread/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment, author: session.user.name }),
    });
    if (res.ok) {
      setThreads((prev) =>
        prev.map((thread) =>
          thread._id === threadId
            ? { ...thread, comments: [...thread.comments, { content: newComment, createdAt: new Date() }] }
            : thread
        )
      );
      setNewComment("");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forum & Knowledge Base</h1>
      <Toaster richColors={true} position="bottom-right" visibleToasts={1} />
      {threadModal && <ThreadModal thread={threadModalData} onClose={() => setThreadModal(false)} />}
      {threads.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No Threads Available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {threads.map((thread) => (
            <motion.div
              key={thread._id}
              className="p-4 shadow-lg bg-white rounded-xl border border-gray-200"
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                setThreadModal(!threadModal)
                setThreadModalData(thread)
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900">{thread.title}</h3>
              <p className="text-sm text-gray-500">{thread.category}</p>
              <p className="text-xs text-gray-400">By {thread.author || "Anonymous"} - {new Date(thread.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mt-2">{thread.content.substring(0, 100)}...</p>
              <div className="flex justify-between items-center mt-4 text-gray-700">
                <span className="flex items-center text-gray-500">
                  <Eye className="w-5 h-5 mr-1" /> {thread.views}
                </span>
                <button className="flex items-center" onClick={(e) => {
                  e.stopPropagation();
                  setActiveThread(thread)
                }}>
                  <MessageSquare className="w-5 h-5 mr-1" /> {thread.comments.length}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Add Thread Button */}
      {session && (session.user.role === 'admin' || session.user.role === 'Lead') && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      )}

      {/* Modal for Adding Thread */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            className="bg-white p-6 rounded-xl w-96 shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold mb-4">Create New Thread</h3>
            <input
              type="hidden"
              value={session.user.email}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2 rounded-md"
              placeholder="Enter thread title"
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2 rounded-md"
              placeholder="Enter your name"
              readOnly
              value={session.user.name}
            />
            <textarea
              className="border p-2 w-full mb-2 rounded-md"
              placeholder="Enter thread content"
              rows="4"
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
            />
            <select
              className="border p-2 w-full mb-2 rounded-md"
              value={newThread.category}
              onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
            >
              <option value="FAQs">FAQs</option>
              <option value="Guides">Guides</option>
              <option value="Policies">Policies</option>
              <option value="Survey">Survey</option>
            </select>
            <div className="flex justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded-md mr-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleAddThread}>
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comments Section */}
      {activeThread && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            className="bg-white p-6 rounded-xl w-96 shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold">{activeThread.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{activeThread.content}</p>
            <div className="border-t pt-2">
              {activeThread.comments.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 border-b last:border-b-0 bg-white shadow-sm rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-800">{c.content}</p>
                    <span className="text-xs text-gray-500">By: {c.author}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(activeThread._id, c._id, "upvote");
                      }}
                    >
                      <ThumbsUp className="w-5 h-5" /> {c.upvotes}
                    </button>
                    <button
                      className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(activeThread._id, c._id, "downvote");
                      }}
                    >
                      <ThumbsDown className="w-5 h-5" /> {c.downvotes}
                    </button>
                  </div>
                </div>
              ))}
              <input
                type="text"
                className="border p-2 w-full rounded-md mt-2"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md" onClick={() => {
                handleAddComment(activeThread._id)
                setActiveThread(null)
              }}>
                Comment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
