"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const segmentationData = [
  { name: "High-Value Customers", value: 30, color: "#4CAF50" },
  { name: "Frequent Users", value: 45, color: "#2196F3" },
  { name: "New Users", value: 25, color: "#FFC107" },
];

const engagementData = [
  { channel: "Email", count: 400 },
  { channel: "Social Media", count: 800 },
  { channel: "Website", count: 600 },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Customer Segmentation & Targeting</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Analyze customer behavior, engagement, and retention strategies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Segmentation Pie Chart */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Data Repository</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={segmentationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {segmentationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement & Interaction Logs */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Engagement & Interaction Logs</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
