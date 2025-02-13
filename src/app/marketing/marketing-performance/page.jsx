"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Page() {
  // State for data
  const [attributionData, setAttributionData] = useState([
    { model: "First-Touch", value: 40 },
    { model: "Multi-Touch", value: 35 },
    { model: "Last-Click", value: 25 },
  ]);

  const [conversionData, setConversionData] = useState([
    { stage: "Leads", count: 500 },
    { stage: "MQLs", count: 300 },
    { stage: "SQLs", count: 200 },
    { stage: "Customers", count: 100 },
  ]);

  const [adSpendData, setAdSpendData] = useState([
    { month: "Jan", adSpend: 5000, revenue: 12000 },
    { month: "Feb", adSpend: 7000, revenue: 15000 },
    { month: "Mar", adSpend: 8000, revenue: 18000 },
  ]);

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  // Functions to update charts
  const addAttributionData = (model, value) => {
    setAttributionData([...attributionData, { model, value: parseInt(value) }]);
  };

  const addConversionData = (stage, count) => {
    setConversionData([...conversionData, { stage, count: parseInt(count) }]);
  };

  const addAdSpendData = (month, adSpend, revenue) => {
    setAdSpendData([...adSpendData, { month, adSpend: parseInt(adSpend), revenue: parseInt(revenue) }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📊 Marketing Performance & ROI Analysis
        </h1>

        {/* Attribution Model Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Marketing Attribution Models
          </h2>
          <div className="flex justify-center w-full">
            <ResponsiveContainer width="70%" height={250}>
              <PieChart>
                <Pie data={attributionData} dataKey="value" nameKey="model" outerRadius={100} label>
                  {attributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Add Attribution Data */}
          <div className="mt-4 flex gap-2">
            <input id="attrModel" type="text" placeholder="Model Name" className="border p-2 rounded-md" />
            <input id="attrValue" type="number" placeholder="Value" className="border p-2 rounded-md" />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() =>
                addAttributionData(
                  document.getElementById("attrModel").value,
                  document.getElementById("attrValue").value
                )
              }
            >
              Add Data
            </button>
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Lead-to-Customer Conversion Rates
          </h2>
          <div className="flex justify-center w-full">
            <ResponsiveContainer width="70%" height={250}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Add Conversion Data */}
          <div className="mt-4 flex gap-2">
            <input id="convStage" type="text" placeholder="Stage Name" className="border p-2 rounded-md" />
            <input id="convCount" type="number" placeholder="Count" className="border p-2 rounded-md" />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() =>
                addConversionData(
                  document.getElementById("convStage").value,
                  document.getElementById("convCount").value
                )
              }
            >
              Add Data
            </button>
          </div>
        </div>

        {/* Ad Spend vs Revenue */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Ad Spend vs. Revenue Impact
          </h2>
          <div className="flex justify-center w-full">
            <ResponsiveContainer width="90%" height={300}>
              <LineChart data={adSpendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="adSpend" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Add Ad Spend Data */}
          <div className="mt-4 flex gap-2">
            <input id="adMonth" type="text" placeholder="Month" className="border p-2 rounded-md" />
            <input id="adSpend" type="number" placeholder="Ad Spend" className="border p-2 rounded-md" />
            <input id="adRevenue" type="number" placeholder="Revenue" className="border p-2 rounded-md" />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() =>
                addAdSpendData(
                  document.getElementById("adMonth").value,
                  document.getElementById("adSpend").value,
                  document.getElementById("adRevenue").value
                )
              }
            >
              Add Data
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
