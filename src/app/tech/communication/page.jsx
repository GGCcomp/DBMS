"use client"
import { useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Scheduled Maintenance", details: "Servers will be down from 2 AM - 4 AM", type: "⚠️ Alert" },
    { id: 2, title: "Security Update", details: "New security patches applied.", type: "🔒 Security" }
  ]);

  const [supportLogs, setSupportLogs] = useState([
    { id: 1, title: "VPN Issue", details: "Resolved VPN connection problem", status: "✅ Fixed" },
    { id: 2, title: "Software Bug", details: "Investigating slow performance", status: "🕒 In Progress" }
  ]);

  const [feedback, setFeedback] = useState([
    { id: 1, name: "John Doe", message: "Great IT support, very responsive!" },
    { id: 2, name: "Jane Smith", message: "Need faster response times during outages." }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [newEntry, setNewEntry] = useState({ id: null, title: "", details: "", type: "", status: "" });

  const openModal = (item = null, type) => {
    setNewEntry(item || { id: null, title: "", details: "", type: "", status: "" });
    setEntryType(type);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (newEntry.id) {
      if (entryType === "announcement") {
        setAnnouncements(announcements.map(a => (a.id === newEntry.id ? newEntry : a)));
      } else if (entryType === "support") {
        setSupportLogs(supportLogs.map(s => (s.id === newEntry.id ? newEntry : s)));
      }
    } else {
      const newItem = { ...newEntry, id: Date.now() };
      if (entryType === "announcement") {
        setAnnouncements([...announcements, newItem]);
      } else if (entryType === "support") {
        setSupportLogs([...supportLogs, newItem]);
      }
    }
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-white">
      <motion.h1 className="text-4xl font-extrabold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        📢 Communication & Collaboration Hub
      </motion.h1>

      {/* Announcements */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">IT Announcements & Alerts</h2>
          <button onClick={() => openModal(null, "announcement")} className="bg-pink-500 text-white px-6 py-3 mb-2 rounded-lg hover:bg-pink-600 transition">+ Add</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map(a => (
            <motion.div key={a.id} className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:scale-95 transition">
              <h3 className="text-xl font-bold">{a.title}</h3>
              <p className="text-gray-200">{a.details}</p>
              <p className="text-sm text-gray-300">{a.type}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Logs */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Live IT Support Logs</h2>
          <button onClick={() => openModal(null, "support")} className="bg-pink-500 text-white px-6 py-3 mb-2 rounded-lg hover:bg-pink-600 transition">+ Add</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportLogs.map(s => (
            <motion.div key={s.id} className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:scale-95 transition">
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="text-gray-200">{s.details}</p>
              <p className="text-sm text-gray-300">{s.status}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div>
        <h2 className="text-2xl font-semibold">Employee Feedback & Surveys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map(f => (
            <motion.div key={f.id} className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:scale-95 transition">
              <h3 className="text-xl font-bold">{f.name}</h3>
              <p className="text-gray-200">{f.message}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div className="bg-white p-6 rounded-lg w-96 shadow-xl text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4">{newEntry.id ? "Edit Entry" : "Add New Entry"}</h2>
            <input type="text" placeholder="Title" className="w-full p-2 mb-3 border border-gray-300 rounded" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} />
            <textarea placeholder="Details" className="w-full p-2 mb-3 border border-gray-300 rounded" value={newEntry.details} onChange={(e) => setNewEntry({ ...newEntry, details: e.target.value })} />
            <div className="flex justify-between">
              <button onClick={() => setModalOpen(false)} className="text-gray-500">Cancel</button>
              <button onClick={handleSave} className="bg-pink-500 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
