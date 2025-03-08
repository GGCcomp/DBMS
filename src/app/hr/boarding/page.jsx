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
  const [employee, setEmployee] = useState("");
  const [training, setTraining] = useState("");
  const [status, setStatus] = useState("");
  const [OffboardingName, setOffboardingName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const addOnboardingDoc = async (e) => {
    e.preventDefault();
    if (newDoc.trim() && newFile.length > 0) {
      const formData = new FormData();
      formData.append("name", newDoc);

      newFile.forEach((file) => {
        formData.append("file", file);
      });

      const res = await fetch("/api/hr/boarding/on-boarding", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchData();
        setNewDoc("");
        setNewFile([]);
      }
    }
  };


  const addTrainingLog = async () => {
    if (employee.trim()) {
      const res = await fetch("/api/hr/boarding/training", {
        method: "POST",
        body: JSON.stringify({ employee, course: training, status }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        fetchData();
        setTraining("");
        setEmployee("");
        setStatus("");
      }
    }
  };

  const addOffboardingRecord = async (e) => {
    e.preventDefault();
    if (newDoc.trim() && newFile.length > 0) {
      const formData = new FormData();
      formData.append("name", newDoc);
      formData.append("email", email);
      formData.append("employee", OffboardingName);
      formData.append("department", department);

      newFile.forEach((file) => {
        formData.append("file", file);
      });

      const res = await fetch("/api/hr/boarding/off-boarding", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchData();
        setNewDoc("");
        setEmail("");
        setDepartment("");
        setOffboardingName("");
        setNewFile([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-10 w-full"
      >
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Onboarding & Offboarding Records</h1>
        <p className="text-white text-lg mb-8 text-center">Manage employee documentation, training compliance, and exit approvals.</p>

        <div className="grid grid-cols-1 gap-6">
          {/* Onboarding Section */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📄 Onboarding Docs</h2>

            <form onSubmit={addOnboardingDoc} className="bg-white p-6 rounded-xl shadow-md">
              <input
                type="text"
                placeholder="Enter document name"
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
                required
              />
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => setNewFile([...e.target.files])}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
                required
              />
              <button className="bg-pink-500 text-white font-semibold px-5 py-3 rounded-lg w-full transition-all hover:bg-pink-600">
                ➕ Add Document
              </button>
            </form>

            <ul className="text-gray-700 mt-6 space-y-3">
              {onboardingDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center transition-all hover:shadow-lg"
                >
                  <span>📄 {doc.fileName}</span>
                  <div className="flex gap-2">
                    {doc.previewUrls.map((preview, i) => <button key={i}
                      onClick={() => setSelectedDoc(preview)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      View
                    </button>)}
                    {doc.downloadUrls.map((download, i) => <Link key={i}
                      href={download}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                    >
                      Download
                    </Link>)}
                  </div>
                </li>
              ))}
            </ul>

            {selectedDoc && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">📑 PDF Preview</h2>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      ✖
                    </button>
                  </div>
                  <iframe src={selectedDoc} className="w-full h-[500px] border rounded-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Training Compliance Section */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📚 Training Logs</h2>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <input
                type="text"
                placeholder="Enter training course"
                value={training}
                onChange={(e) => setTraining(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Enter Employee Name"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
              />
              <select
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">Select Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <button onClick={addTrainingLog} className="bg-pink-500 text-white font-semibold px-5 py-3 rounded-lg w-full transition-all hover:bg-pink-600">
                ➕ Add Training Log
              </button>
            </div>

            <ul className="text-gray-700 mt-6 space-y-3">
              {trainingLogs.map((log) => (
                <li key={log.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-all">
                  📚 {log.employee}: {log.course} <span className="text-blue-600 font-medium">({log.status})</span>
                </li>
              ))}
            </ul>
          </div>


          {/* Offboarding Section */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🔚 Exit & Final Clearance</h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <form onSubmit={addOffboardingRecord} className="bg-white p-6 rounded-xl shadow-md">
                <input
                  type="text"
                  placeholder="Enter employee name"
                  value={OffboardingName}
                  onChange={(e) => setOffboardingName(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />
                <input
                  type="email"
                  placeholder="Enter employee email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />
                <select onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400 bg-white">
                  <option value="">Select a department</option>
                  <option value="Development">Development</option>
                  <option value="Compliance">Compliance</option>
                  <option value="CyberSecurity">Cyber Security</option>
                  <option value="Sales">Sales</option>
                  <option value="Research">Research</option>
                </select>

                <input
                  type="text"
                  placeholder="Enter document name"
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
                  required
                />
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => setNewFile([...e.target.files])}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
                  required
                />
                <button className="bg-pink-500 text-white font-semibold px-5 py-3 rounded-lg w-full transition-all hover:bg-pink-600">
                  ➕ Add Exit Record
                </button>
              </form>
            </div>
            <ul className="text-gray-600 text-left space-y-4 mt-4">
              {offboardingRecords.map((record) => (
                <article
                  key={record.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                    <h3 className="font-semibold text-lg">
                      🔚 {record.employee}
                      <span className="text-red-600 ml-2">({record.department})</span>
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {record.previewUrls.map((preview, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDoc(preview)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                      >
                        View
                      </button>
                    ))}

                    {record.downloadUrls.map((download, i) => (
                      <Link
                        key={i}
                        href={download}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                      >
                        Download
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </ul>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
