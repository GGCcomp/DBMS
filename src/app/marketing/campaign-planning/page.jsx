"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function page() {
  // Campaign Data
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Social Media Ads", date: "2025-02-15", budget: 5000, status: "Pending", channel: "Digital" },
    { id: 2, name: "Influencer Marketing", date: "2025-03-01", budget: 8000, status: "Approved", channel: "Partnerships" },
  ]);
  const [newCampaign, setNewCampaign] = useState({ name: "", date: "", budget: "", status: "Pending", channel: "" });

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewCampaign({ ...newCampaign, [e.target.name]: e.target.value });
  };

  // Add New Campaign
  const addCampaign = () => {
    if (newCampaign.name.trim() && newCampaign.date.trim() && newCampaign.budget.trim() && newCampaign.channel.trim()) {
      setCampaigns([...campaigns, { ...newCampaign, id: Date.now(), budget: parseFloat(newCampaign.budget) }]);
      setNewCampaign({ name: "", date: "", budget: "", status: "Pending", channel: "" });
    }
  };

  // Edit Budget
  const updateBudget = (id, value) => {
    const updated = campaigns.map((campaign) => (campaign.id === id ? { ...campaign, budget: parseFloat(value) || 0 } : campaign));
    setCampaigns(updated);
  };

  // Update Status
  const updateStatus = (id, status) => {
    const updated = campaigns.map((campaign) => (campaign.id === id ? { ...campaign, status } : campaign));
    setCampaigns(updated);
  };

  // Remove Campaign
  const removeCampaign = (id) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📅 Campaign Planning & Execution</h1>

        {/* Add New Campaign */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" name="name" placeholder="Campaign Name" value={newCampaign.name} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="date" name="date" value={newCampaign.date} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="budget" placeholder="Budget (₹)" value={newCampaign.budget} onChange={handleInputChange} className="p-2 border rounded" />
          <select name="channel" value={newCampaign.channel} onChange={handleInputChange} className="p-2 border rounded">
            <option value="">Select Channel</option>
            <option value="Digital">Digital</option>
            <option value="Offline">Offline</option>
            <option value="Partnerships">Partnerships</option>
          </select>
          <button onClick={addCampaign} className="col-span-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
            Add Campaign
          </button>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-100 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Campaign</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Budget (₹)</th>
                <th className="p-3 text-left">Channel</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <motion.tr key={campaign.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="border-b">
                  <td className="p-3">{campaign.name}</td>
                  <td className="p-3">{campaign.date}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={campaign.budget}
                      onChange={(e) => updateBudget(campaign.id, e.target.value)}
                      className="w-20 p-1 border rounded text-center"
                    />
                  </td>
                  <td className="p-3">{campaign.channel}</td>
                  <td className="p-3">
                    <select
                      value={campaign.status}
                      onChange={(e) => updateStatus(campaign.id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => removeCampaign(campaign.id)} className="text-red-500 hover:text-red-700">
                      ❌ Remove
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
