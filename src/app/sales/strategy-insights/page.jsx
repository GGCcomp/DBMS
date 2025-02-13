"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [activeTab, setActiveTab] = useState("marketResearch");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const data = {
    marketResearch: [
      { id: 1, title: "Fintech Growth Trends", summary: "Analysis of fintech sector growth in 2025.", details: "This report covers investment trends, emerging technologies, and market opportunities in fintech." },
      { id: 2, title: "Competitor Analysis: PayTech", summary: "A deep dive into PayTech’s recent expansion.", details: "PayTech has expanded into 3 new regions and adopted AI-driven fraud detection." },
    ],
    caseStudies: [
      { id: 1, client: "ABC Corp", success: "Increased revenue by 30%", details: "By using our fintech solution, ABC Corp optimized payments and improved cash flow efficiency." },
      { id: 2, client: "XYZ Ltd", success: "Reduced fraud cases by 50%", details: "XYZ Ltd integrated our AI fraud detection, reducing financial fraud cases significantly." },
    ],
    training: [
      { id: 1, topic: "Fintech Product Guide", duration: "2 hours", details: "Comprehensive training on our fintech solutions, covering features and best practices." },
      { id: 2, topic: "Advanced Sales Playbook", duration: "3 hours", details: "This playbook provides best sales strategies, objection handling, and conversion techniques." },
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
        {/* Tabs */}
        <div className="flex justify-around bg-gray-200 p-2 rounded-lg">
          {["marketResearch", "caseStudies", "training"].map((tab) => (
            <button
              key={tab}
              className={`p-2 px-4 rounded-lg transition ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "marketResearch" && "Market Research"}
              {tab === "caseStudies" && "Case Studies"}
              {tab === "training" && "Training & Playbooks"}
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
              <div key={item.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <div
                  className="cursor-pointer"
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                >
                  <p className="font-bold">
                    {activeTab === "marketResearch" && item.title}
                    {activeTab === "caseStudies" && `Client: ${item.client}`}
                    {activeTab === "training" && `Topic: ${item.topic}`}
                  </p>
                  <p className="text-gray-600">
                    {activeTab === "marketResearch" && item.summary}
                    {activeTab === "caseStudies" && `Success: ${item.success}`}
                    {activeTab === "training" && `Duration: ${item.duration}`}
                  </p>
                </div>
                
                {expanded === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-2 bg-white rounded-md shadow-inner"
                  >
                    <p>{item.details}</p>
                  </motion.div>
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
