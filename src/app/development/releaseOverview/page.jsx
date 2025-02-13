"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const Modal = ({ title, defaultValue, onClose, onSave }) => {
  const [inputValue, setInputValue] = useState(defaultValue || "");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter details"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
            onClick={() => onSave(inputValue)}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Page = () => {
  const [logs, setLogs] = useState({
    releases: [],
    deployments: [],
    alerts: [],
    changes: [],
  });
  const [modalData, setModalData] = useState({ open: false, type: "", data: "" });

  const handleOpenModal = (type, data = "") => {
    setModalData({ open: true, type, data });
  };

  const handleSaveLog = (type, data) => {
    setLogs((prev) => ({
      ...prev,
      [type]: [...prev[type], data],
    }));
    setModalData({ open: false, type: "", data: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-white mb-6"
      >
        Development & Release Overview
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
            <h2 className="text-2xl font-semibold text-white capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h2>
            <ul className="mt-3 space-y-2">
              {logs[key].length > 0 ? (
                logs[key].map((log, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-900 bg-opacity-30 text-white rounded-lg cursor-pointer hover:bg-opacity-50 transition"
                    onClick={() => handleOpenModal(key, log)}
                  >
                    {log}
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
        <Modal
          title={`Manage ${modalData.type.replace(/([A-Z])/g, " $1").trim()}`}
          defaultValue={modalData.data}
          onClose={() => setModalData({ open: false, type: "", data: "" })}
          onSave={(data) => handleSaveLog(modalData.type, data)}
        />
      )}
    </div>
  );
};

export default Page;
