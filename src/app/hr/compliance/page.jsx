"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [policies, setPolicies] = useState([]);
  const [grievanceReports, setGrievanceReports] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ title: "", link: "" });
  const [newGrievance, setNewGrievance] = useState("");

  useEffect(() => {
    fetch("/api/hr/compliance/policies").then(res => res.json()).then(setPolicies);
    fetch("/api/hr/compliance/grievance").then(res => res.json()).then(setGrievanceReports);
  }, []);

  const addPolicy = async () => {
    if (!newPolicy.title || !newPolicy.link) return;
    const res = await fetch("/api/hr/compliance/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPolicy),
    });
    if (res.ok) {
      setPolicies([...policies, newPolicy]);
      setNewPolicy({ title: "", link: "" });
    }
  };

  const addGrievanceReport = async () => {
    if (!newGrievance) return;
    const res = await fetch("/api/hr/compliance/grievance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue: newGrievance, status: "Pending" }),
    });
    if (res.ok) {
      setGrievanceReports([...grievanceReports, { issue: newGrievance, status: "Pending" }]);
      setNewGrievance("");
    }
  };

  const updateGrievanceStatus = async (id, status) => {
    const res = await fetch("/api/hr/compliance/grievance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setGrievanceReports(grievanceReports.map(g => g.id === id ? { ...g, status } : g));
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">HR Policy Repository</h2>
            <input
              type="text"
              placeholder="Policy Title"
              value={newPolicy.title}
              onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Policy Link"
              value={newPolicy.link}
              onChange={(e) => setNewPolicy({ ...newPolicy, link: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addPolicy} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full mb-4">Add Policy</button>
            <ul className="text-gray-600 text-left space-y-2">
              {policies.map((policy, index) => (
                <li key={index} className="bg-white p-3 rounded shadow">
                  📜 <a href={policy.link} className="text-blue-600 font-medium" target="_blank" rel="noopener noreferrer">{policy.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Incident & Grievance Reports</h2>
            <input
              type="text"
              placeholder="Enter grievance report"
              value={newGrievance}
              onChange={(e) => setNewGrievance(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addGrievanceReport} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full mb-4">Submit Report</button>
            <ul className="text-gray-600 text-left space-y-2">
              {grievanceReports.map((report) => (
                <li key={report._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <span>⚠️ <strong>{report.employee}:</strong> {report.issue} (<span className="text-red-600">{report.status}</span>)</span>
                  <select
                    className="border rounded p-1 ml-2"
                    value={report.status}
                    onChange={(e) => updateGrievanceStatus(report._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}