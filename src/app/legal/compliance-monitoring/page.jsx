"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiShield, FiUsers, FiLock, FiPlus } from "react-icons/fi";

const complianceData = [
  {
    title: "Legal Dispute Tracking",
    description: "Documents legal issues, regulatory filings, and dispute resolutions.",
    icon: <FiShield className="text-purple-500 text-3xl" />,
    data: [
      ["Case ID", "LD-102"],
      ["Filed Date", "2023-08-12"],
      ["Resolution Status", "Ongoing"],
    ],
    document: null,
  },
  {
    title: "Whistleblower & Grievance Logs",
    description: "Maintains records of workplace complaints and legal escalations.",
    icon: <FiUsers className="text-indigo-500 text-3xl" />,
    data: [
      ["Complaint ID", "WB-078"],
      ["Employee Name", "Michael Brown"],
      ["Status", "Under Investigation"],
    ],
    document: null,
  },
  {
    title: "Risk & Fraud Prevention Oversight",
    description: "Tracks fraud detection mechanisms, security risks, and regulatory concerns.",
    icon: <FiLock className="text-gray-500 text-3xl" />,
    data: [
      ["Incident ID", "RF-305"],
      ["Reported Date", "2024-02-05"],
      ["Action Taken", "Security Audit Scheduled"],
    ],
    document: null,
  },
];

const Page = () => {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(complianceData);
  const [newEntry, setNewEntry] = useState({ id: "", date: "", status: "", document: null });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewEntry((prev) => ({ ...prev, document: { name: file.name, url } }));
    }
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (selected !== null) {
      const newData = [...data];
      newData[selected].data.push([
        ["Case ID", newEntry.id],
        ["Filed Date", newEntry.date],
        ["Resolution Status", newEntry.status],
      ]);
      newData[selected].document = newEntry.document;
      setData(newData);
      setNewEntry({ id: "", date: "", status: "", document: null });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-8"
      >
        Compliance & Risk Management
      </motion.h1>
      
      <div className="w-full max-w-4xl grid gap-6">
        {data.map((item, index) => (
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-h-[80vh] overflow-y-scroll">
            <h2 className="text-xl font-semibold mb-4">{data[selected].title}</h2>
            <div className="">
              {data[selected].data.map(([label, value], idx) => (
                <table key={idx} className="w-full border-collapse border border-gray-300 mb-2">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-2 font-medium text-gray-700 border-r border-gray-300">{label}</td>
                      <td className="p-2 text-gray-600">{value}</td>
                    </tr>
                  </tbody>
                </table>
              ))}
              {data[selected].document && (
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="p-2 font-medium text-gray-700 border-r border-gray-300">Document</td>
                      <td className="p-2 text-gray-600">
                        <a href={data[selected].document.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a> | 
                        <a href={data[selected].document.url} download className="text-blue-500 underline"> Download</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <form onSubmit={handleAddEntry}>
              <input type="text" required placeholder="Case ID" className="w-full p-2 border border-gray-300 rounded mb-2" onChange={(e) => setNewEntry({ ...newEntry, id: e.target.value })} />
              <input type="date" required className="w-full p-2 border border-gray-300 rounded mb-2" onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} />
              <input type="text" required placeholder="Resolution Status" className="w-full p-2 border border-gray-300 rounded mb-2" onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })} />
              <input type="file" accept=".pdf,.xlsx" className="w-full mb-2" onChange={handleFileUpload} />
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">Add</button>
              <button className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition" type="button" onClick={() => setSelected(null)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
