"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Page() {
  const [lifecycleLogs, setLifecycleLogs] = useState([
    { id: 1, name: "John Doe", event: "Promoted to Senior Developer", date: "2025-01-15" },
    { id: 2, name: "Jane Smith", event: "Transferred to Finance", date: "2024-12-10" },
  ]);

  const [newLog, setNewLog] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const addLifecycleLog = () => {
    if (newLog.trim() && employeeName.trim()) {
      setLifecycleLogs([
        ...lifecycleLogs,
        { id: Date.now(), name: employeeName, event: newLog, date: new Date().toISOString().split("T")[0] },
      ]);
      setNewLog("");
      setEmployeeName("");
    }
  };

  // Sample Data for Workforce Metrics
  const workforceData = [
    { category: "Engineering", count: 40 },
    { category: "Finance", count: 25 },
    { category: "HR", count: 15 },
    { category: "Marketing", count: 20 },
  ];

  // Compliance Status
  const complianceRecords = [
    { id: 1, policy: "AML Compliance", status: "Passed" },
    { id: 2, policy: "GDPR Training", status: "Pending" },
    { id: 3, policy: "PCI DSS Security", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">HR Compliance & Insights</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Monitor employee lifecycle, diversity metrics, and compliance adherence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Lifecycle Logs */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Employee Lifecycle Logs</h2>
            <input
              type="text"
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Enter event (Promotion, Transfer, etc.)"
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addLifecycleLog} className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full mb-4">
              Add Log
            </button>
            <ul className="text-gray-600 text-left space-y-2">
              {lifecycleLogs.map((log) => (
                <li key={log.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>
                    👤 <strong>{log.name}:</strong> {log.event}{" "}
                    (<span className="text-blue-600">{log.date}</span>)
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Workforce Diversity Metrics */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Diversity & Workforce Metrics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workforceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Monitoring */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Compliance Monitoring</h2>
            <ul className="text-gray-600 text-left space-y-2">
              {complianceRecords.map((record) => (
                <li key={record.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>
                    📜 <strong>{record.policy}</strong>
                  </span>
                  <span
                    className={`font-bold ${
                      record.status === "Pending"
                        ? "text-yellow-500"
                        : record.status === "Completed"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {record.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
