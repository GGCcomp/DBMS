"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiBriefcase, FiClipboard } from "react-icons/fi";

const complianceData = [
  {
    title: "Business Licenses & Legal Filings",
    description: "Manages company registrations, operational licenses, and compliance documentation.",
    icon: <FiFileText className="text-blue-500 text-3xl" />,
    data: [
      ["ID", "BL-210"],
      ["Issue Date", "2022-07-15"],
      ["Renewal Due", "2025-07-15"],
    ],
    document: null,
  },
  {
    title: "Corporate Governance & Ethics",
    description: "Ensures transparency in decision-making, conflict-of-interest policies, and board compliance.",
    icon: <FiBriefcase className="text-green-500 text-3xl" />,
    data: [
      ["ID", "CG-101"],
      ["Last Review", "2023-09-01"],
      ["Status", "Active"],
    ],
    document: null,
  },
  {
    title: "Regulatory Reporting & Audits",
    description: "Tracks filings, inspections, and compliance-related audits.",
    icon: <FiClipboard className="text-orange-500 text-3xl" />,
    data: [
      ["ID", "RA-456"],
      ["Audit Date", "2024-01-10"],
      ["Compliance Status", "Passed"],
    ],
    document: null,
  },
];

const Page = () => {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(complianceData);
  const [newEntry, setNewEntry] = useState({ Id: "", issueDate: "", renewalDue: "", document: null });

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
      newData[selected].data.push(
        ["ID", newEntry.Id],
        ["Issue Date", newEntry.issueDate],
        ["Renewal Due", newEntry.renewalDue]
      );
      newData[selected].document = newEntry.document;
      setData(newData);
      setNewEntry({ Id: "", issueDate: "", renewalDue: "", document: null });
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
        Compliance & Regulatory Management
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
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <tbody>
                {data[selected].data.map(([label, value], idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-2 font-medium text-gray-700 border-r border-gray-300">{label}</td>
                    <td className="p-2 text-gray-600">{value}</td>
                  </tr>
                ))}
                {data[selected].document && (
                  <tr>
                    <td className="p-2 font-medium text-gray-700 border-r border-gray-300">Document</td>
                    <td className="p-2 text-gray-600">
                      <a href={data[selected].document.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View
                      </a>{" "}
                      |{" "}
                      <a href={data[selected].document.url} download className="text-blue-500 underline">
                        Download
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <form onSubmit={handleAddEntry} className="space-y-2">
              <input
                type="text"
                required
                placeholder="ID"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setNewEntry({ ...newEntry, Id: e.target.value })}
                value={newEntry.Id}
              />
              <input
                type="date"
                required
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setNewEntry({ ...newEntry, issueDate: e.target.value })}
                value={newEntry.issueDate}
              />
              <input
                type="date"
                required
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setNewEntry({ ...newEntry, renewalDue: e.target.value })}
                value={newEntry.renewalDue}
              />
              <input type="file" accept=".pdf,.xlsx" className="w-full" onChange={handleFileUpload} />

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
                  Add Entry
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
