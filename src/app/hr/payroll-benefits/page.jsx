"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PayrollExpenseTracking() {
  const [salarySlips, setSalarySlips] = useState([
    { id: 1, month: "January 2025", link: "#" },
    { id: 2, month: "December 2024", link: "#" },
  ]);

  const [expenseClaims, setExpenseClaims] = useState([
    { id: 1, item: "Business Travel", status: "Approved" },
    { id: 2, item: "Home Office Setup", status: "Pending" },
  ]);

  const [bonuses, setBonuses] = useState([
    { id: 1, type: "Performance Bonus", amount: "₹ 2,000" },
    { id: 2, type: "Stock Options (ESOPs)", amount: "2 Shares" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Payroll & Expense Tracking
        </h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Manage salary slips, expense claims, and performance incentives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Slips */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Salary Slip Repository</h2>
            <ul className="text-gray-600 space-y-2">
              {salarySlips.map((slip) => (
                <li key={slip.id} className="bg-white p-3 rounded shadow">
                  📄 <strong>{slip.month}:</strong> <a href={slip.link} className="text-blue-600 underline">View Slip</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Expense Reimbursement */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Expense Reimbursement</h2>
            <ul className="text-gray-600 space-y-2">
              {expenseClaims.map((claim) => (
                <li key={claim.id} className="bg-white p-3 rounded shadow flex justify-between">
                  💰 <strong>{claim.item}</strong>
                  <span className={claim.status === "Approved" ? "text-green-600" : "text-yellow-600"}>{claim.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bonuses & Incentives */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Bonuses & Incentives Log</h2>
          <ul className="text-gray-600 space-y-2">
            {bonuses.map((bonus) => (
              <li key={bonus.id} className="bg-white p-3 rounded shadow">
                🎉 <strong>{bonus.type}</strong>: {bonus.amount}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
