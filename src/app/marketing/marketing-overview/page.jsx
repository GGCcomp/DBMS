"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function pagee() {
  // Sample Data
  const campaignData = [
    { name: "Q1", conversion: 15, engagement: 70, ROI: 120 },
    { name: "Q2", conversion: 20, engagement: 85, ROI: 150 },
    { name: "Q3", conversion: 18, engagement: 78, ROI: 140 },
    { name: "Q4", conversion: 25, engagement: 92, ROI: 180 },
  ];

  const brandAwarenessData = [
    { platform: "Facebook", reach: 5000 },
    { platform: "Twitter", reach: 3200 },
    { platform: "LinkedIn", reach: 4100 },
    { platform: "Instagram", reach: 6000 },
  ];

  const funnelData = [
    { stage: "Leads", count: 1000 },
    { stage: "Prospects", count: 700 },
    { stage: "Opportunities", count: 400 },
    { stage: "Conversions", count: 250 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Marketing Overview & Performance</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Tracks marketing efforts, brand growth, and campaign success.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campaign Performance Metrics */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Campaign Performance Metrics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversion" stroke="#6366F1" name="Conversion Rate" />
                <Line type="monotone" dataKey="engagement" stroke="#10B981" name="Engagement Level" />
                <Line type="monotone" dataKey="ROI" stroke="#F59E0B" name="ROI (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Brand Awareness & Reach */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Brand Awareness & Reach</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={brandAwarenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reach" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Marketing Funnel Analysis */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Marketing Funnel Analysis</h2>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
        
          </div>

          {/* Customer Behavior & Market Trends */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Behavior & Market Trends</h2>
            <ul className="text-gray-600 text-left space-y-2">
              <li className="bg-white p-3 rounded shadow">📊 Fintech adoption increased by 20% in Q3.</li>
              <li className="bg-white p-3 rounded shadow">📈 Mobile banking app usage grew by 35%.</li>
              <li className="bg-white p-3 rounded shadow">💳 Younger users prefer digital wallets over credit cards.</li>
              <li className="bg-white p-3 rounded shadow">🔍 SEO-driven blog content led to a 45% increase in traffic.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
