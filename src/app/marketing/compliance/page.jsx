"use client"
import { useState } from "react";
import { motion } from "framer-motion";

export default function page() {
  const [complianceLogs, setComplianceLogs] = useState([]);
  const [materialName, setMaterialName] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [consentLogs, setConsentLogs] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [auditReports, setAuditReports] = useState([]);
  const [reportName, setReportName] = useState("");

  const addComplianceLog = () => {
    if (materialName.trim()) {
      setComplianceLogs([...complianceLogs, { materialName, approvalStatus }]);
      setMaterialName("");
      setApprovalStatus("Pending");
    }
  };

  const addConsentLog = () => {
    if (customerName.trim()) {
      setConsentLogs([...consentLogs, { customerName, consentGiven }]);
      setCustomerName("");
      setConsentGiven(false);
    }
  };

  const addAuditReport = () => {
    if (reportName.trim()) {
      setAuditReports([...auditReports, { reportName, date: new Date().toISOString().split("T")[0] }]);
      setReportName("");
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
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Compliance & Regulatory Marketing</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">Ensure fintech marketing meets legal and regulatory standards.</p>

        {/* Compliance Logs */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Compliance Review Logs</h2>
          <input 
            type="text" 
            placeholder="Marketing Material Name" 
            value={materialName} 
            onChange={(e) => setMaterialName(e.target.value)} 
            className="w-full p-2 border rounded mb-2"
          />
          <select 
            value={approvalStatus} 
            onChange={(e) => setApprovalStatus(e.target.value)} 
            className="w-full p-2 border rounded mb-4"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>
          <button onClick={addComplianceLog} className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Log</button>
          <ul className="text-gray-600 text-left space-y-2">
            {complianceLogs.map((log, index) => (
              <li key={index} className="bg-white p-3 rounded shadow flex justify-between">
                <span>{log.materialName} - <strong>{log.approvalStatus}</strong></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Consent Logs */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Data Privacy & Consent Tracking</h2>
          <input 
            type="text" 
            placeholder="Customer Name" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            className="w-full p-2 border rounded mb-2"
          />
          <label className="flex items-center mb-4">
            <input 
              type="checkbox" 
              checked={consentGiven} 
              onChange={(e) => setConsentGiven(e.target.checked)} 
              className="mr-2"
            />
            Consent Given
          </label>
          <button onClick={addConsentLog} className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Consent</button>
          <ul className="text-gray-600 text-left space-y-2">
            {consentLogs.map((log, index) => (
              <li key={index} className="bg-white p-3 rounded shadow flex justify-between">
                <span>{log.customerName} - <strong>{log.consentGiven ? "✔ Given" : "❌ Not Given"}</strong></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audit Reports */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Audit & Regulatory Reports</h2>
          <input 
            type="text" 
            placeholder="Report Name" 
            value={reportName} 
            onChange={(e) => setReportName(e.target.value)} 
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={addAuditReport} className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Report</button>
          <ul className="text-gray-600 text-left space-y-2">
            {auditReports.map((report, index) => (
              <li key={index} className="bg-white p-3 rounded shadow flex justify-between">
                <span>{report.reportName} - <strong>{report.date}</strong></span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
