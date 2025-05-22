"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket-client"; // adjust path if needed

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    const handleMessage = (data) => {
      console.log("Received on client:", data);
      setChatLog((prev) => [...prev, data]);
    };

    socket.on("chat-message", handleMessage);

    return () => socket.off("chat-message", handleMessage);
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      socket.emit("chat-message", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-xl max-w-xl mx-auto mt-10 shadow">
      <h2 className="text-xl font-semibold mb-2">Live Chat</h2>
      <div className="h-64 overflow-y-auto bg-white p-2 rounded border mb-3">
        {chatLog.map((msg, i) => (
          <div key={i} className="p-1 text-sm border-b border-gray-200">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
}
