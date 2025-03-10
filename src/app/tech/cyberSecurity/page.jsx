"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [logs, setLogs] = useState({ compliance: [], security: [], incident: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState("");
  const [newLogData, setNewLogData] = useState("");

  // Fetch logs from API
  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("/api/tech/logs");
        const data = await response.json();
        if (data.success) {
          const categorizedLogs = { compliance: [], security: [], incident: [] };
          data.logs.forEach((log) => categorizedLogs[log.type].push(log.message));
          setLogs(categorizedLogs);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    fetchLogs();
  }, []);

  // Open Modal
  const handleOpenModal = (logType) => {
    setSelectedLogType(logType);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewLogData("");
  };

  // Submit Log
  const handleSubmitLog = async () => {
    if (newLogData.trim()) {
      try {
        const response = await fetch("/api/tech/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: selectedLogType, message: newLogData }),
        });

        const data = await response.json();
        if (data.success) {
          setLogs((prev) => ({
            ...prev,
            [selectedLogType]: [...prev[selectedLogType], newLogData],
          }));
        }
      } catch (error) {
        console.error("Error adding log:", error);
      }

      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 py-10 px-6">
      <div className="max-w-6xl mx-auto text-white">
        <motion.h1 className="text-4xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          Cybersecurity & Compliance Tracking
        </motion.h1>

        {["compliance", "security", "incident"].map((type) => (
          <motion.div
            key={type}
            className="bg-white p-6 rounded-lg shadow-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {type.charAt(0).toUpperCase() + type.slice(1)} Logs
            </h2>
            <ul className="list-disc pl-5 text-gray-800 mb-4">
              {logs[type].map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
            <button
              className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
              onClick={() => handleOpenModal(type)}
            >
              Add {type.charAt(0).toUpperCase() + type.slice(1)} Log
            </button>
          </motion.div>
        ))}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-4">
                Add {selectedLogType.charAt(0).toUpperCase() + selectedLogType.slice(1)} Log
              </h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
                rows="4"
                value={newLogData}
                onChange={(e) => setNewLogData(e.target.value)}
                placeholder="Enter log data here"
              ></textarea>
              <div className="flex justify-between">
                <button className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition" onClick={handleSubmitLog}>
                  Submit
                </button>
                <button className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
