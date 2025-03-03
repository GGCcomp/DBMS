"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [fraudCases, setFraudCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFraudCases = async () => {
      const res = await fetch("/api/fraud-log");
      const data = await res.json();
      setFraudCases(data);
      setLoading(false);
    };
    fetchFraudCases();
  }, []);

  if (loading) return <p className="text-center">Loading fraud cases...</p>;

  return (
    <div className="h-screen">
      <motion.div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h2 className="text-2xl font-semibold mb-4">Fraud Cases & Compliance Tickets</h2>

        {fraudCases.length === 0 ? (
          <p>No open fraud cases.</p>
        ) : (
          fraudCases.map((caseItem) => (
            <div key={caseItem._id} className="p-3 border rounded-md mb-3">
              <p><strong>Email:</strong> {caseItem.fraudId.email}</p>
              <p><strong>Issue:</strong> {typeof caseItem.fraudId.reason === "string" ? caseItem.fraudId.reason : JSON.stringify(caseItem.fraudId.reason)}</p>
              <p><strong>Assigned To:</strong> {caseItem.assignedTo}</p>
              <p className="text-sm text-gray-500">Logged: {new Date(caseItem.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}
