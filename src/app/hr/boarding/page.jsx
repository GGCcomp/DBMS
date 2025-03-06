"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  const [onboardingDocs, setOnboardingDocs] = useState([]);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [offboardingRecords, setOffboardingRecords] = useState([]);

  const fetchData = async () => {
    const [onboardingRes, trainingRes, offboardingRes] = await Promise.all([
      fetch("/api/hr/boarding/on-boarding").then((res) => res.json()),
      fetch("/api/hr/boarding/training").then((res) => res.json()),
      fetch("/api/hr/boarding/off-boarding").then((res) => res.json()),
    ]);

    setOnboardingDocs(onboardingRes);
    setTrainingLogs(trainingRes);
    setOffboardingRecords(offboardingRes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [newDoc, setNewDoc] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newTraining, setNewTraining] = useState("");
  const [newOffboarding, setNewOffboarding] = useState("");

  const addOnboardingDoc = async (e) => {
    e.preventDefault();
    if (newDoc.trim() && newFile) {
      const formData = new FormData();
      formData.append("name", newDoc);
      formData.append("file", newFile);

      const res = await fetch("/api/hr/boarding/on-boarding", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchData();
        setNewDoc("");
        setNewFile(null);
      }
    }
  };

  const addTrainingLog = async () => {
    if (newTraining.trim()) {
      const res = await fetch("/api/hr/boarding/training", {
        method: "POST",
        body: JSON.stringify({ employee: "Admin", course: newTraining, status: "Ongoing" }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        fetchData();
        setNewTraining("");
      }
    }
  };

  const addOffboardingRecord = async () => {
    if (newOffboarding.trim()) {
      const res = await fetch("/api/hr/boarding/off-boarding", {
        method: "POST",
        body: JSON.stringify({ employee: newOffboarding, status: "Pending Approval" }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        fetchData();
        setNewOffboarding("");
      }
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
            <form onSubmit={addOnboardingDoc}>
              <input
                type="text"
                placeholder="Enter document name"
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setNewFile(e.target.files[0])}
                className="w-full p-2 border rounded mb-4"
                required
              />

              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">
                Add Document
              </button>
            </form>
            <div>
              <ul className="text-gray-600 text-left space-y-2">
                {onboardingDocs.map((doc) => (
                  <li
                    key={doc.id}
                    className="bg-white p-3 rounded shadow flex justify-between items-center"
                  >
                    <span>📄 {doc.fileName}</span>
                    <button
                      onClick={() => setSelectedDoc(doc.previewUrl)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <Link href={doc.downloadUrl}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 ml-2"
                    >
                      Download
                    </Link>
                  </li>
                ))}
              </ul>

              {selectedDoc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-4 w-full max-w-3xl">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-semibold">PDF Preview</h2>
                      <button
                        onClick={() => setSelectedDoc(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✖ Close
                      </button>
                    </div>
                    <iframe
                      src={selectedDoc}
                      className="w-full h-[500px] border rounded"
                    />
                  </div>
                </div>
              )}
            </div>
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
