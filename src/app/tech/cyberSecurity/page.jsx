"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

const Page = () => {
  const [complianceLogs, setComplianceLogs] = useState([
    'Adherence to PCI DSS, GDPR, ISO 27001, SOC 2, AML, and KYC regulations.',
    'Audit report for GDPR updated on 01/2025.',
    'Compliance checklist reviewed for SOC 2 on 12/2024.',
  ]);
  const [securityLogs, setSecurityLogs] = useState([
    'Data encryption guidelines are updated as per ISO 27001.',
    'Key management policies documented for new cloud integration.',
    'Phishing awareness training completed by 80% of employees.',
  ]);
  const [incidentReports, setIncidentReports] = useState([
    'Threat alert for XSS vulnerability received on 01/2025.',
    'Incident response for phishing attempt on 12/2024: resolved.',
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState('');
  const [newLogData, setNewLogData] = useState('');

  const handleOpenModal = (logType) => {
    setSelectedLogType(logType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewLogData('');
  };

  const handleSubmitLog = () => {
    if (newLogData.trim()) {
      if (selectedLogType === 'compliance') {
        setComplianceLogs([...complianceLogs, newLogData]);
      } else if (selectedLogType === 'security') {
        setSecurityLogs([...securityLogs, newLogData]);
      } else if (selectedLogType === 'incident') {
        setIncidentReports([...incidentReports, newLogData]);
      }
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 py-10 px-6">
      <div className="max-w-6xl mx-auto text-white">
        <motion.h1
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Cybersecurity & Compliance Tracking
        </motion.h1>

        {/* Compliance Monitoring */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Compliance Monitoring</h2>
          <ul className="list-disc pl-5 text-gray-800 mb-4">
            {complianceLogs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
          <button
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
            onClick={() => handleOpenModal('compliance')}
          >
            Add Compliance Log
          </button>
        </motion.div>

        {/* Security Policies & Training */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Security Policies & Training</h2>
          <ul className="list-disc pl-5 text-gray-800 mb-4">
            {securityLogs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
          <button
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
            onClick={() => handleOpenModal('security')}
          >
            Add Security Log
          </button>
        </motion.div>

        {/* Threat Intelligence & Incident Reports */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Threat Intelligence & Incident Reports</h2>
          <ul className="list-disc pl-5 text-gray-800 mb-4">
            {incidentReports.map((report, index) => (
              <li key={index}>{report}</li>
            ))}
          </ul>
          <button
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
            onClick={() => handleOpenModal('incident')}
          >
            Add Incident Report
          </button>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <button className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition">
            View Detailed Reports
          </button>
        </motion.div>
      </div>

      {/* Modal for adding new logs */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4">
              Add {selectedLogType.charAt(0).toUpperCase() + selectedLogType.slice(1)} Log
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              rows="4"
              value={newLogData}
              onChange={(e) => setNewLogData(e.target.value)}
              placeholder="Enter log data here"
            ></textarea>
            <div className="flex justify-between">
              <button
                className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
                onClick={handleSubmitLog}
              >
                Submit
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
