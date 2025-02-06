"use client"
import { useState } from "react";
import { motion } from "framer-motion";

export default function page() {
  const [backupLogs, setBackupLogs] = useState([
    { id: 1, title: "Daily Backup", details: "Database backup at 2 AM", status: "✅ Successful" },
    { id: 2, title: "Restore Test", details: "Q4 report restore test", status: "🕒 Pending" },
  ]);

  const [failoverTests, setFailoverTests] = useState([
    { id: 1, title: "Failover Drill", details: "Tested AWS failover", status: "✅ Completed" },
    { id: 2, title: "Redundancy Check", details: "Checked multi-region redundancy", status: "🔄 Ongoing" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [entryType, setEntryType] = useState("backupLog");
  const [newEntry, setNewEntry] = useState({ id: null, title: "", details: "", status: "" });

  const openModal = (item = null, type) => {
    setNewEntry(item || { id: null, title: "", details: "", status: "" });
    setEntryType(type);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (newEntry.id) {
      if (entryType === "backupLog") {
        setBackupLogs(backupLogs.map(log => (log.id === newEntry.id ? newEntry : log)));
      } else {
        setFailoverTests(failoverTests.map(test => (test.id === newEntry.id ? newEntry : test)));
      }
    } else {
      const newItem = { ...newEntry, id: Date.now() };
      entryType === "backupLog"
        ? setBackupLogs([...backupLogs, newItem])
        : setFailoverTests([...failoverTests, newItem]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id, type) => {
    type === "backupLog"
      ? setBackupLogs(backupLogs.filter(log => log.id !== id))
      : setFailoverTests(failoverTests.filter(test => test.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-white">
      <motion.h1 
        className="text-4xl font-extrabold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        Disaster Recovery & Business Continuity
      </motion.h1>

      {/* Backup & Restore Logs */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">📂 Backup & Restore Logs</h2>
          <button
            onClick={() => openModal(null, "backupLog")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            + Add Log
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {backupLogs.map(log => (
            <motion.div
              key={log.id}
              className="p-4 rounded-lg bg-white bg-opacity-20 shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-bold">{log.title}</h3>
              <p className="text-gray-200 mt-1">{log.details}</p>
              <p className="text-sm text-gray-300 mt-2">{log.status}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => openModal(log, "backupLog")} className="text-pink-400 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(log.id, "backupLog")} className="text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Redundancy & Failover Testing */}
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">🛠️ Redundancy & Failover Testing</h2>
          <button
            onClick={() => openModal(null, "failoverTest")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            + Add Test
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {failoverTests.map(test => (
            <motion.div
              key={test.id}
              className="p-4 rounded-lg bg-white bg-opacity-20 shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-bold">{test.title}</h3>
              <p className="text-gray-200 mt-1">{test.details}</p>
              <p className="text-sm text-gray-300 mt-2">{test.status}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => openModal(test, "failoverTest")} className="text-pink-400 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(test.id, "failoverTest")} className="text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            className="bg-white p-6 rounded-lg w-96 shadow-xl text-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4">{newEntry.id ? "Edit Entry" : "Add New Entry"}</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            />
            <textarea
              placeholder="Details"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={newEntry.details}
              onChange={(e) => setNewEntry({ ...newEntry, details: e.target.value })}
            />
            <input
              type="text"
              placeholder="Status"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={newEntry.status}
              onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}
            />
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
