"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [logs, setLogs] = useState({
    unitIntegrationTesting: [],
    regressionUAT: [],
    securityTesting: [],
    bugTracking: [],
    loadStressTesting: [],
  });
  const [modalData, setModalData] = useState({ open: false, type: "", index: null });
  const [inputValue, setInputValue] = useState("");

  const handleOpenModal = (type, index = null) => {
    setModalData({ open: true, type, index });
    setInputValue(index !== null ? logs[type][index] : "");
  };

  const handleSaveLog = () => {
    if (!inputValue.trim()) return;
    setLogs((prev) => {
      const updatedLogs = { ...prev };
      if (modalData.index !== null) {
        updatedLogs[modalData.type][modalData.index] = inputValue;
      } else {
        updatedLogs[modalData.type] = [...prev[modalData.type], inputValue];
      }
      return updatedLogs;
    });
    setModalData({ open: false, type: "", index: null });
    setInputValue("");
  };

  const handleDeleteLog = (type, index) => {
    setLogs((prev) => {
      const updatedLogs = { ...prev };
      updatedLogs[type] = prev[type].filter((_, i) => i !== index);
      return updatedLogs;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-white mb-6"
      >
        Testing & Quality Assurance Reports
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
                    className="p-3 bg-gray-900 bg-opacity-30 text-white rounded-lg flex justify-between items-center hover:bg-opacity-50 transition"
                  >
                    <span onClick={() => handleOpenModal(key, index)} className="cursor-pointer">
                      {log}
                    </span>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDeleteLog(key, index)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-300 text-sm">No logs available.</p>
              )}
            </ul>
            <button
              className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
              onClick={() => handleOpenModal(key)}
            >
              + Add {key.replace(/([A-Z])/g, " $1").trim()}
            </button>
          </motion.div>
        ))}
      </div>

      {modalData.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{modalData.index !== null ? "Edit" : "Add"} {modalData.type.replace(/([A-Z])/g, " $1").trim()}</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setModalData({ open: false, type: "", index: null })}
              >
                Cancel
              </button>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                onClick={handleSaveLog}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
