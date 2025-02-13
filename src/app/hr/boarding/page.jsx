"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [onboardingDocs, setOnboardingDocs] = useState([
    { id: 1, name: "Offer Letter - John Doe.pdf", type: "Offer Letter" },
    { id: 2, name: "Background Check - Jane Smith.pdf", type: "Verification" },
  ]);

  const [trainingLogs, setTrainingLogs] = useState([
    { id: 1, employee: "John Doe", course: "AML Compliance", status: "Completed" },
    { id: 2, employee: "Jane Smith", course: "KYC Regulations", status: "Pending" },
  ]);

  const [offboardingRecords, setOffboardingRecords] = useState([
    { id: 1, employee: "John Doe", status: "Final Clearance Pending" },
    { id: 2, employee: "Jane Smith", status: "Access Revoked" },
  ]);

  const [newDoc, setNewDoc] = useState("");
  const [newTraining, setNewTraining] = useState("");
  const [newOffboarding, setNewOffboarding] = useState("");

  const addOnboardingDoc = () => {
    if (newDoc.trim()) {
      setOnboardingDocs([...onboardingDocs, { id: Date.now(), name: newDoc, type: "Custom" }]);
      setNewDoc("");
    }
  };

  const addTrainingLog = () => {
    if (newTraining.trim()) {
      setTrainingLogs([...trainingLogs, { id: Date.now(), employee: "Admin", course: newTraining, status: "Ongoing" }]);
      setNewTraining("");
    }
  };

  const addOffboardingRecord = () => {
    if (newOffboarding.trim()) {
      setOffboardingRecords([...offboardingRecords, { id: Date.now(), employee: newOffboarding, status: "Pending Approval" }]);
      setNewOffboarding("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Onboarding & Offboarding Records</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">Manage employee documentation, training compliance, and exit approvals.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Onboarding Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Onboarding Documentation</h2>
            <input
              type="text"
              placeholder="Enter document name"
              value={newDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addOnboardingDoc} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">
              Add Document
            </button>
            <ul className="text-gray-600 text-left space-y-2">
              {onboardingDocs.map((doc) => (
                <li key={doc.id} className="bg-white p-3 rounded shadow flex justify-between">
                  📄 {doc.name} ({doc.type})
                </li>
              ))}
            </ul>
          </div>

          {/* Training Compliance Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Training Compliance Logs</h2>
            <input
              type="text"
              placeholder="Enter training course"
              value={newTraining}
              onChange={(e) => setNewTraining(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addTrainingLog} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">
              Add Training Log
            </button>
            <ul className="text-gray-600 text-left space-y-2">
              {trainingLogs.map((log) => (
                <li key={log.id} className="bg-white p-3 rounded shadow flex justify-between">
                  📚 {log.employee}: {log.course} (<span className="text-blue-600">{log.status}</span>)
                </li>
              ))}
            </ul>
          </div>

          {/* Offboarding Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Exit & Final Clearance</h2>
            <input
              type="text"
              placeholder="Enter employee name"
              value={newOffboarding}
              onChange={(e) => setNewOffboarding(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addOffboardingRecord} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">
              Add Exit Record
            </button>
            <ul className="text-gray-600 text-left space-y-2">
              {offboardingRecords.map((record) => (
                <li key={record.id} className="bg-white p-3 rounded shadow flex justify-between">
                  🔚 {record.employee} - <span className="text-red-600">{record.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
