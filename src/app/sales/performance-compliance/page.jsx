"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [activeTab, setActiveTab] = useState("targets");
  const [search, setSearch] = useState("");

  const data = {
    targets: [
      { id: 1, name: "Aman", goal: "₹10,000", achieved: "₹7,500" },
      { id: 2, name: "Suhan", goal: "₹8,000", achieved: "₹5,500" },
    ],
    compliance: [
      { id: 1, type: "KYC", status: "Completed", date: "2025-01-15" },
      { id: 2, type: "AML", status: "Pending", date: "2025-02-01" },
    ],
    salesLogs: [
      { id: 1, action: "Closed Deal", amount: "₹5,000", timestamp: "2025-02-10 14:30" },
      { id: 2, action: "Follow-up Call", amount: "₹2,000", timestamp: "2025-02-11 10:15" },
    ],
    training: [
      { id: 1, employee: "Priyam", course: "AML Compliance", completed: "Yes" },
      { id: 2, employee: "Monu", course: "PCI DSS", completed: "No" },
    ],
  };

  const filteredData = data[activeTab].filter((item) =>
    Object.values(item).some((val) => val.toString().toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl"
      >
        <div className="flex justify-around bg-gray-200 p-2 rounded-lg">
          {["targets", "compliance", "salesLogs", "training"].map((tab) => (
            <button
              key={tab}
              className={`p-2 px-4 rounded-lg transition ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "targets" && "Sales Targets"}
              {tab === "compliance" && "Audit & Compliance"}
              {tab === "salesLogs" && "Sales Activity"}
              {tab === "training" && "Training Records"}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              <div key={item.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                {activeTab === "targets" && (
                  <>
                    <p><strong>Salesperson:</strong> {item.name}</p>
                    <p><strong>Goal:</strong> {item.goal}</p>
                    <p><strong>Achieved:</strong> {item.achieved}</p>
                  </>
                )}
                {activeTab === "compliance" && (
                  <>
                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                    <p><strong>Date:</strong> {item.date}</p>
                  </>
                )}
                {activeTab === "salesLogs" && (
                  <>
                    <p><strong>Action:</strong> {item.action}</p>
                    <p><strong>Amount:</strong> {item.amount}</p>
                    <p><strong>Timestamp:</strong> {item.timestamp}</p>
                  </>
                )}
                {activeTab === "training" && (
                  <>
                    <p><strong>Employee:</strong> {item.employee}</p>
                    <p><strong>Course:</strong> {item.course}</p>
                    <p><strong>Completed:</strong> {item.completed}</p>
                  </>
                )}
              </div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;
