"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [trainingRecords, setTrainingRecords] = useState([
    { id: 1, employee: "John Doe", course: "AML Training", status: "Completed" },
    { id: 2, employee: "Jane Smith", course: "GDPR Compliance", status: "In Progress" },
  ]);

  const [policies, setPolicies] = useState([
    { id: 1, title: "Code of Conduct", link: "#" },
    { id: 2, title: "Workplace Ethics", link: "#" },
  ]);

  const [grievanceReports, setGrievanceReports] = useState([
    { id: 1, employee: "Michael Scott", issue: "Harassment Report", status: "Under Review" },
  ]);

  const [newTraining, setNewTraining] = useState("");
  const [newPolicy, setNewPolicy] = useState("");
  const [newGrievance, setNewGrievance] = useState("");

  const addTrainingRecord = () => {
    if (newTraining.trim()) {
      setTrainingRecords([...trainingRecords, { id: Date.now(), employee: "Admin", course: newTraining, status: "Pending" }]);
      setNewTraining("");
    }
  };

  const addPolicy = () => {
    if (newPolicy.trim()) {
      setPolicies([...policies, { id: Date.now(), title: newPolicy, link: "#" }]);
      setNewPolicy("");
    }
  };

  const addGrievanceReport = () => {
    if (newGrievance.trim()) {
      setGrievanceReports([...grievanceReports, { id: Date.now(), employee: "Anonymous", issue: newGrievance, status: "Pending" }]);
      setNewGrievance("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Compliance & HR Policies</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">Ensuring regulatory adherence and ethical workplace practices.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Regulatory Training Records</h2>
            <input
              type="text"
              placeholder="Enter new training record"
              value={newTraining}
              onChange={(e) => setNewTraining(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addTrainingRecord} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Record</button>
            <ul className="text-gray-600 text-left space-y-2">
              {trainingRecords.map(record => (
                <li key={record.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>📚 <strong>{record.employee}:</strong> {record.course} (<span className="text-blue-600">{record.status}</span>)</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">HR Policy Repository</h2>
            <input
              type="text"
              placeholder="Enter new policy"
              value={newPolicy}
              onChange={(e) => setNewPolicy(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addPolicy} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Policy</button>
            <ul className="text-gray-600 text-left space-y-2">
              {policies.map(policy => (
                <li key={policy.id} className="bg-white p-3 rounded shadow">
                  📜 <a href={policy.link} className="text-blue-600 font-medium">{policy.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Incident & Grievance Reports</h2>
          <input
            type="text"
            placeholder="Enter new grievance report"
            value={newGrievance}
            onChange={(e) => setNewGrievance(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={addGrievanceReport} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">Submit Report</button>
          <ul className="text-gray-600 text-left space-y-2">
            {grievanceReports.map(report => (
              <li key={report.id} className="bg-white p-3 rounded shadow flex justify-between">
                <span>⚠️ <strong>{report.employee}:</strong> {report.issue} (<span className="text-red-600">{report.status}</span>)</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
