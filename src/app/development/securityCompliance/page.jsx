"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [logs, setLogs] = useState({
    compliance: [],
    audits: [],
    incidents: [],
    encryption: [],
  });
  const [editIndex, setEditIndex] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [currentType, setCurrentType] = useState("");

  const handleAddOrEditLog = () => {
    if (!inputValue.trim()) return;
    setLogs((prev) => {
      const updatedLogs = { ...prev };
      if (editIndex !== null) {
        updatedLogs[currentType][editIndex] = inputValue;
      } else {
        updatedLogs[currentType] = [...updatedLogs[currentType], inputValue];
      }
      return updatedLogs;
    });
    resetForm();
  };

  const handleEdit = (type, index) => {
    setCurrentType(type);
    setEditIndex(index);
    setInputValue(logs[type][index]);
  };

  const handleDelete = (type, index) => {
    setLogs((prev) => {
      const updatedLogs = { ...prev };
      updatedLogs[type] = updatedLogs[type].filter((_, i) => i !== index);
      return updatedLogs;
    });
  };

  const resetForm = () => {
    setEditIndex(null);
    setInputValue("");
    setCurrentType("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-white mb-6"
      >
        Security & Compliance Documentation
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {Object.keys(logs).map((key) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-6 bg-white bg-opacity-20 rounded-lg backdrop-blur-md shadow-lg hover:scale-105 transition"
          >
            <h2 className="text-2xl font-semibold text-white capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <ul className="mt-3 space-y-2">
              {logs[key].length > 0 ? (
                logs[key].map((log, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-900 bg-opacity-30 text-white rounded-lg flex justify-between items-center"
                  >
                    <span>{log}</span>
                    <div className="space-x-2">
                      <button
                        className="bg-yellow-400 text-black px-2 py-1 rounded"
                        onClick={() => handleEdit(key, index)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(key, index)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-300 text-sm">No logs available.</p>
              )}
            </ul>
            <button
              className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
              onClick={() => setCurrentType(key)}
            >
              + Add {key.replace(/([A-Z])/g, " $1").trim()}
            </button>
          </motion.div>
        ))}
      </div>

      {currentType && (
        <div className="fixed bottom-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">{editIndex !== null ? "Edit" : "Add"} {currentType.replace(/([A-Z])/g, " $1").trim()}</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
              onClick={handleAddOrEditLog}
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;