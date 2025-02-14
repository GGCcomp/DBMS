"use client";

import { useState } from "react";
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiCalendar, FiDownload, FiEye } from "react-icons/fi";

const agreements = [
  {
    title: "Vendor & Partner Agreements",
    description: "Manage contracts with third-party vendors and business partners.",
    icon: <FiFileText className="text-blue-500 text-3xl" />,
    data: [
      { name: "ABC Corp", type: "Supplier", partnershipDate: "2021-05-15", document: null },
      { name: "XYZ Ltd", type: "Service Provider", partnershipDate: "2022-01-10", document: null },
      { name: "Global Traders", type: "Distributor", partnershipDate: "2023-03-22", document: null },
    ],
  },
  {
    title: "Employee Agreements & NDAs",
    description: "Store employee contracts, NDAs, and compliance clauses.",
    icon: <FiCheckCircle className="text-green-500 text-3xl" />,
    data: [
      { name: "John Doe", position: "Software Engineer", agreementDate: "2020-07-01", document: null },
      { name: "Jane Smith", position: "HR Manager", agreementDate: "2021-09-15", document: null },
      { name: "Robert Brown", position: "Finance Analyst", agreementDate: "2022-12-05", document: null },
    ],
  },
  {
    title: "Client & Investor Contracts",
    description: "Manage legal agreements with clients and investors.",
    icon: <FiAlertTriangle className="text-yellow-500 text-3xl" />,
    data: [
      { name: "Client A", contractType: "Service Agreement", agreementDate: "2021-06-10", document: null },
      { name: "Investor B", contractType: "Equity Investment", agreementDate: "2022-02-20", document: null },
    ],
  },
  {
    title: "Renewal & Expiry Management",
    description: "Track contract renewal and expiry dates.",
    icon: <FiCalendar className="text-red-500 text-3xl" />,
    data: [
      { name: "ABC Corp", contractType: "Supplier", expiryDate: "2024-05-15", document: null },
      { name: "XYZ Ltd", contractType: "Service Provider", expiryDate: "2025-01-10", document: null },
    ],
  },
];

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [newEntry, setNewEntry] = useState({});

  const openModal = (item) => {
    setModalContent(item);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setNewEntry((prev) => ({ ...prev, document: e.target.files[0] }));
  };

  const addEntry = () => {
    if (modalContent) {
      modalContent.data.push(newEntry);
      setNewEntry({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Legal & Contract Management</h1>
      
      <div className="w-full max-w-4xl grid gap-6">
        {agreements.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-md rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={() => openModal(item)}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[70%] max-h-[80vh] overflow-y-scroll">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{modalContent.title}</h2>
            <p className="text-gray-600 mb-4">{modalContent.description}</p>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(modalContent.data[0]).map((key, idx) => (
                    <th key={idx} className="border border-gray-300 p-2 text-left capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modalContent.data.map((row, idx) => (
                  <tr key={idx} className="border border-gray-300">
                    {Object.entries(row).map(([key, value], i) => (
                      <td key={i} className="border border-gray-300 p-2">
                        {key.includes("Date") ? (
                          <input type="date" value={value} className="border p-1" readOnly />
                        ) : key === "document" && value ? (
                          <div className="flex justify-between px-4 items-center gap-2">
                            <a href={URL.createObjectURL(value)} target="_blank" rel="noopener noreferrer" className="text-blue-500"><FiEye size={20}/></a>
                            <a href={URL.createObjectURL(value)} download className="text-green-500"><FiDownload size={20}/></a>
                          </div>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <h3 className="font-semibold">Add New Entry</h3>
              {Object.keys(modalContent.data[0]).map((key, idx) => (
                <div key={idx} className="mb-2">
                  <label className="block text-sm font-medium">{key.replace(/([A-Z])/g, ' $1')}</label>
                  {key.includes("Date") ? (
                    <input type="date" name={key} className="w-full p-2 border rounded" onChange={handleInputChange} />
                  ) : key === "document" ? (
                    <input type="file" className="w-full p-2 border rounded" onChange={handleFileUpload} />
                  ) : (
                    <input type="text" name={key} className="w-full p-2 border rounded" onChange={handleInputChange} />
                  )}
                </div>
              ))}
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition" onClick={addEntry}>Add</button>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;