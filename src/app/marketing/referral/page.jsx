"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ReferralPartnerTracking() {
  const [referrals, setReferrals] = useState([
    { id: 1, name: "Avantika", referrals: 5, bonus: "₹50" },
    { id: 2, name: "Priyam", referrals: 8, bonus: "₹80" },
  ]);
  const [newReferral, setNewReferral] = useState({ name: "", referrals: "", bonus: "" });

  const addReferral = () => {
    if (newReferral.name && newReferral.referrals && newReferral.bonus) {
      setReferrals([...referrals, { id: Date.now(), ...newReferral }]);
      setNewReferral({ name: "", referrals: "", bonus: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Referral & Partner Program Tracking</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">Manage and analyze referral and partnership data effectively.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Referral Program Data */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Referral Program Performance</h2>
            <input 
              type="text" 
              placeholder="Partner Name" 
              value={newReferral.name} 
              onChange={(e) => setNewReferral({ ...newReferral, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input 
              type="number" 
              placeholder="Referrals Count" 
              value={newReferral.referrals} 
              onChange={(e) => setNewReferral({ ...newReferral, referrals: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input 
              type="text" 
              placeholder="Bonus Earned" 
              value={newReferral.bonus} 
              onChange={(e) => setNewReferral({ ...newReferral, bonus: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addReferral} className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Referral</button>
            <ul className="text-gray-600 text-left space-y-2">
              {referrals.map((ref) => (
                <li key={ref.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>👤 <strong>{ref.name}</strong> - {ref.referrals} referrals - {ref.bonus}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Chart */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Referral Performance Chart</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={referrals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="referrals" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
