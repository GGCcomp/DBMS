"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function Page() {
  // Time Range for Filtering
  const [timeRange, setTimeRange] = useState("Monthly");

  // 📊 Marketing Funnel Data
  const [funnelData, setFunnelData] = useState([
    { stage: "Awareness", count: 500 },
    { stage: "Interest", count: 300 },
    { stage: "Consideration", count: 200 },
    { stage: "Conversion", count: 100 },
  ]);
  const [newStage, setNewStage] = useState("");
  const [newCount, setNewCount] = useState("");

  // 📈 Campaign Performance Data (Conversion & Engagement Rates)
  const performanceData = [
    { name: "Week 1", conversion: 5, engagement: 20 },
    { name: "Week 2", conversion: 8, engagement: 35 },
    { name: "Week 3", conversion: 12, engagement: 50 },
    { name: "Week 4", conversion: 15, engagement: 70 },
  ];

  // 🌍 Brand Awareness Data (Social Media & Website Traffic)
  const brandAwarenessData = [
    { platform: "Facebook", users: 1200 },
    { platform: "Instagram", users: 1800 },
    { platform: "Twitter", users: 800 },
    { platform: "Website", users: 2500 },
  ];
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"];

  // 🔍 Customer Behavior Data (User Activity Trends)
  const behaviorData = [
    { name: "Email", value: 30 },
    { name: "Social Media", value: 40 },
    { name: "Direct Visit", value: 20 },
    { name: "Referrals", value: 10 },
  ];

  // 📊 Add New Funnel Stage
  const addNewData = () => {
    if (newStage.trim() && newCount.trim() && !isNaN(newCount)) {
      setFunnelData([...funnelData, { stage: newStage, count: parseInt(newCount) }]);
      setNewStage("");
      setNewCount("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📊 Marketing Performance Dashboard</h1>

        {/* Time Range Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {["Weekly", "Monthly", "Yearly"].map((range) => (
            <button
              key={range}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === range ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Grid Layout for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 📊 Marketing Funnel Analysis */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Marketing Funnel Analysis</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Stage Name"
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Count"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                className="p-2 border rounded"
              />
              <button onClick={addNewData} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                Add Data
              </button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 📈 Campaign Performance Metrics */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Campaign Performance</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversion" stroke="#36A2EB" />
                <Line type="monotone" dataKey="engagement" stroke="#FF6384" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🌍 Brand Awareness & Social Reach */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Brand Awareness</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={brandAwarenessData} dataKey="users" nameKey="platform" outerRadius={100}>
                  {brandAwarenessData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🔍 Customer Behavior & Market Trends */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Behavior Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={behaviorData} dataKey="value" nameKey="name" outerRadius={100}>
                  {behaviorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
