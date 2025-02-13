"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function page() {
  const [pipelineData, setPipelineData] = useState([
    { stage: "Prospecting", count: 5 },
    { stage: "Negotiation", count: 3 },
    { stage: "Proposal Sent", count: 2 },
    { stage: "Closed-Won", count: 4 },
    { stage: "Closed-Lost", count: 1 },
  ]);

  const [newStage, setNewStage] = useState("");
  const [newCount, setNewCount] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [modalData, setModalData] = useState(null);

  const addNewStage = () => {
    if (newStage.trim() && newCount.trim() && !isNaN(newCount)) {
      setPipelineData([...pipelineData, { stage: newStage, count: parseInt(newCount) }]);
      setNewStage("");
      setNewCount("");
    }
  };

  const saveData = () => {
    const newEntry = {
      dealForecast: document.getElementById("dealForecast").value,
      pricingApprovals: document.getElementById("pricingApprovals").value,
      contracts: document.getElementById("contracts").value,
      signatures: document.getElementById("signatures").value,
    };
    setSavedData([...savedData, newEntry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📊 Pipeline Management</h1>

        {/* Input Fields for Adding Data */}
        <div className="flex flex-col gap-3 mb-6">
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
          <button
            onClick={addNewStage}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Add Stage
          </button>
        </div>

        {/* Pipeline Overview Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pipeline Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Sections */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Deal Probability & Forecasting</h2>
          <input id="dealForecast" type="text" placeholder="Deal Name" className="p-2 border rounded w-full" />
          <input type="number" placeholder="Probability (%)" className="p-2 border rounded w-full" />

          <h2 className="text-xl font-bold">Discount & Pricing Approvals</h2>
          <input id="pricingApprovals" type="text" placeholder="Deal Name" className="p-2 border rounded w-full" />
          <input type="text" placeholder="Discount Details" className="p-2 border rounded w-full" />

          <h2 className="text-xl font-bold">Proposal & Contract Repository</h2>
          <input id="contracts" type="text" placeholder="Contract Name" className="p-2 border rounded w-full" />
          <input type="file" className="p-2 border rounded w-full" />

          <h2 className="text-xl font-bold">E-Signature & Version Control</h2>
          <input id="signatures" type="text" placeholder="Document Name" className="p-2 border rounded w-full" />
          <input type="text" placeholder="Signer Name" className="p-2 border rounded w-full" />
        </div>

        <button
          onClick={saveData}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full"
        >
          Save Data
        </button>

        {/* Saved Data List */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Saved Entries</h2>
          <ul className="space-y-2">
            {savedData.map((entry, index) => (
              <li
                key={index}
                onClick={() => setModalData(entry)}
                className="p-3 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Entry {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Modal for Displaying Entry Details */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Entry Details</h2>
            <p><strong>Deal Forecast:</strong> {modalData.dealForecast}</p>
            <p><strong>Pricing Approvals:</strong> {modalData.pricingApprovals}</p>
            <p><strong>Contracts:</strong> {modalData.contracts}</p>
            <p><strong>Signatures:</strong> {modalData.signatures}</p>
            <button onClick={() => setModalData(null)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
