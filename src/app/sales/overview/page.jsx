"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function Page() {
  // Time Range for Filtering
  const [timeRange, setTimeRange] = useState("Monthly");

  // 📊 Sales Summary Data
  const salesSummary = { revenue: 50000, activeDeals: 120, closedDeals: 80 };

  // 📈 Conversion Rates Data
  const conversionRates = [
    { name: "Jan", rate: 5 },
    { name: "Feb", rate: 8 },
    { name: "Mar", rate: 12 },
    { name: "Apr", rate: 15 },
  ];

  // 📊 Sales Pipeline Data
  const salesPipeline = [
    { stage: "Lead", count: 300 },
    { stage: "Contacted", count: 200 },
    { stage: "Proposal Sent", count: 100 },
    { stage: "Closed", count: 50 },
  ];

  // 🔥 Product Performance Data
  const productPerformance = [
    { name: "Investment Plan A", sales: 400 },
    { name: "Savings Plan B", sales: 320 },
    { name: "Loan Service C", sales: 210 },
  ];

  // 🏆 Team Performance Data
  const teamPerformance = [
    { name: "Vaibhav", target: 100, achieved: 85 },
    { name: "Isha", target: 100, achieved: 75 },
    { name: "Soham", target: 100, achieved: 90 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📊 Sales Overview & Analytics</h1>

        {/* Time Range Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {["Weekly", "Monthly", "Yearly"].map((range) => (
            <button
              key={range}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === range ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {Object.entries(salesSummary).map(([key, value]) => (
            <div key={key} className="bg-gray-200 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700">{key.replace(/([A-Z])/g, " $1").trim()}</h2>
              <p className="text-3xl font-bold text-blue-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 📈 Conversion Rates */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Conversion Rates</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={conversionRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#FF6384" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🔍 Sales Pipeline */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sales Pipeline</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesPipeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#36A2EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Performance */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Team Performance</h2>
          <div className="space-y-4">
            {teamPerformance.map((member) => (
              <div key={member.name} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(member.achieved / member.target) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{member.achieved}/{member.target} deals closed</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
