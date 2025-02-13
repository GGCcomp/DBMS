"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const page = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [search, setSearch] = useState("");

  const data = {
    transactions: [
      { id: 1, invoice: "INV123", amount: "₹500", date: "2025-02-10" },
      { id: 2, invoice: "INV124", amount: "₹250", date: "2025-02-11" },
    ],
    subscriptions: [
      { id: 1, plan: "Premium", nextBilling: "2025-03-10", status: "Active" },
    ],
    commissions: [
      { id: 1, rep: "Amit", earnings: "₹1000", dealsClosed: 5 },
    ],
    taxes: [
      { id: 1, category: "GST", amount: "₹50", regulation: "2025 Compliance" },
    ],
  };

  // Filter data based on search input
  const filteredData = data[activeTab].filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl"
      >
        {/* Tab Navigation */}
        <div className="flex justify-around bg-gray-200 p-2 rounded-lg">
          {Object.keys(data).map((key) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSearch(""); // Reset search when switching tabs
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === key ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Display Data */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-2"
        >
          {filteredData.length === 0 ? (
            <p className="text-gray-500 text-center">No records found</p>
          ) : (
            filteredData.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 p-4 rounded-lg shadow"
              >
                {Object.entries(item).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                  </p>
                ))}
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default page;
