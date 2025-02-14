"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart, X, Eye, Download } from "lucide-react";

const sectionsData = [
  { 
    title: "Monte Carlo & Stress Testing Models", 
    description: "Research on risk simulations for fintech portfolios and economic downturn analysis.", 
    details: [], 
    icon: <TrendingUp className="h-8 w-8 text-red-500" /> 
  },
  { 
    title: "Derivative Pricing & Liquidity Risk", 
    description: "Development of AI-driven valuation models for complex financial instruments.", 
    details: [], 
    icon: <BarChart className="h-8 w-8 text-yellow-500" /> 
  },
];

const Page = () => {
  const [sections, setSections] = useState(sectionsData);
  const [modalIndex, setModalIndex] = useState(null);
  const [newInfo, setNewInfo] = useState("");
  const [newFile, setNewFile] = useState(null);

  // Open modal
  const openModal = (index) => {
    setModalIndex(index);
  };

  // Close modal
  const closeModal = () => {
    setModalIndex(null);
    setNewInfo("");
    setNewFile(null);
  };

  // Add new info with file
  const addInformation = () => {
    if (!newInfo.trim() || !newFile) return;

    const updatedSections = [...sections];
    updatedSections[modalIndex].details.push({ info: newInfo, file: newFile });
    setSections(updatedSections);

    setNewInfo("");
    setNewFile(null);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  // View file
  const viewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // Download file
  const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-8 flex flex-col items-center">
      {/* Title */}
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} 
        className="text-4xl font-bold text-white mb-8">
        Simulation & Risk Analysis
      </motion.h1>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {sections.map((section, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal(index)}
            className="cursor-pointer bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 flex items-start border border-gray-300 transition-all">
            {section.icon}
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-semibold text-gray-700">{section.title}</h2>
              <p className="text-gray-500">{section.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 w-96 shadow-xl">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">{sections[modalIndex]?.title}</h2>
                <button onClick={closeModal}>
                  <X className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                </button>
              </div>

              {/* Existing Information */}
              <div className="mb-4">
                <h3 className="text-gray-700 font-medium">Existing Entries:</h3>
                {sections[modalIndex]?.details.length > 0 ? (
                  <ul className="space-y-2">
                    {sections[modalIndex].details.map((item, i) => (
                      <li key={i} className="bg-gray-100 p-2 rounded-lg flex justify-between items-center">
                        <span className="text-gray-700">{item.info}</span>
                        <div className="flex gap-2">
                          <button onClick={() => viewFile(item.file)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => downloadFile(item.file)} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No entries yet.</p>
                )}
              </div>

              {/* Add New Entry */}
              <div className="mb-4">
                <input type="text" className="w-full border rounded-lg p-2 text-gray-800 focus:outline-none"
                  placeholder="Enter information..." value={newInfo} onChange={(e) => setNewInfo(e.target.value)} />
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-gray-600">Upload Document:</label>
                <input type="file" accept=".pdf,.xlsx" className="mt-2" onChange={handleFileUpload} />
              </div>

              {/* Show Selected File */}
              {newFile && <p className="text-gray-500 text-sm">Selected File: {newFile.name}</p>}

              {/* Add Entry Button */}
              <button onClick={addInformation} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Add Entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
