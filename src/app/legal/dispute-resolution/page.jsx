"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiCalendar, FiShield, FiUsers, FiLock } from "react-icons/fi";

const agreements = [
  {
    title: "Vendor & Partner Agreements",
    description: "Manages contracts with third-party vendors and business partners.",
    icon: <FiFileText className="text-blue-500 text-3xl" />,
    data: [
      ["Vendor Name", "ABC Corp"],
      ["Partnership Date", "2022-03-15"],
      ["Contract Expiry", "2025-03-15"],
    ],
  },
  {
    title: "Employee Agreements & NDAs",
    description: "Stores employee contracts, NDAs, and compliance clauses.",
    icon: <FiCheckCircle className="text-green-500 text-3xl" />,
    data: [
      ["Employee Name", "John Doe"],
      ["NDA Signed Date", "2023-01-10"],
      ["Agreement Expiry", "2026-01-10"],
    ],
  },
  {
    title: "Client & Investor Contracts",
    description: "Tracks legal obligations in client deals, investor agreements, and funding arrangements.",
    icon: <FiAlertTriangle className="text-yellow-500 text-3xl" />,
    data: [
      ["Client Name", "XYZ Ltd."],
      ["Contract Start", "2022-07-20"],
      ["Investment Amount", "$1M"],
    ],
  },
  {
    title: "Renewal & Expiry Management",
    description: "Logs contract renewal dates and legal obligations.",
    icon: <FiCalendar className="text-red-500 text-3xl" />,
    data: [
      ["Contract Name", "Service Agreement"],
      ["Renewal Date", "2024-09-30"],
      ["Expiry Date", "2025-09-30"],
    ],
  },
  {
    title: "Legal Dispute Tracking",
    description: "Documents legal issues, regulatory filings, and dispute resolutions.",
    icon: <FiShield className="text-purple-500 text-3xl" />,
    data: [
      ["Case ID", "LD-001"],
      ["Filed Date", "2023-05-12"],
      ["Resolution Status", "Pending"],
    ],
  },
  {
    title: "Whistleblower & Grievance Logs",
    description: "Maintains records of workplace complaints and legal escalations.",
    icon: <FiUsers className="text-indigo-500 text-3xl" />,
    data: [
      ["Complaint ID", "WB-045"],
      ["Employee Name", "Jane Smith"],
      ["Status", "Under Review"],
    ],
  },
  {
    title: "Risk & Fraud Prevention Oversight",
    description: "Tracks fraud detection mechanisms, security risks, and regulatory concerns.",
    icon: <FiLock className="text-gray-500 text-3xl" />,
    data: [
      ["Incident ID", "RF-202"],
      ["Reported Date", "2024-01-05"],
      ["Action Taken", "Investigation Started"],
    ],
  },
];

const Page = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-8"
      >
        Legal & Contract Management
      </motion.h1>
      
      <div className="w-full max-w-4xl grid gap-6">
        {agreements.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-6 flex items-center justify-between bg-white shadow-md rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 ${
              selected === index ? "ring-2 ring-blue-500" : "hover:shadow-lg"
            }`}
            onClick={() => setSelected(selected === index ? null : index)}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selected !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{agreements[selected].title}</h2>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {agreements[selected].data.map(([label, value], idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-2 font-medium text-gray-700 border-r border-gray-300">{label}</td>
                    <td className="p-2 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
