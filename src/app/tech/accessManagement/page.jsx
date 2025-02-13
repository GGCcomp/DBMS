"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Page() {
  const [accessRecords, setAccessRecords] = useState([
    { id: 1, user: "John Doe", action: "Logged in via SSO", status: "Success" },
    { id: 2, user: "Jane Smith", action: "MFA enabled", status: "Completed" },
  ]);

  const [securityLogs, setSecurityLogs] = useState([
    { id: 1, event: "Failed login attempt", severity: "High" },
    { id: 2, event: "Privilege escalation detected", severity: "Critical" },
  ]);

  const [newAccess, setNewAccess] = useState("");
  const [newSecurityEvent, setNewSecurityEvent] = useState("");

  const addAccessRecord = () => {
    if (newAccess.trim()) {
      setAccessRecords([...accessRecords, { id: Date.now(), user: "Admin", action: newAccess, status: "Pending" }]);
      setNewAccess("");
    }
  };

  const addSecurityLog = () => {
    if (newSecurityEvent.trim()) {
      setSecurityLogs([...securityLogs, { id: Date.now(), event: newSecurityEvent, severity: "Medium" }]);
      setNewSecurityEvent("");
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
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Identity & Access Management</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">Comprehensive access control tracking and security monitoring.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Management Records</h2>
            <input 
              type="text" 
              placeholder="Enter new access record" 
              value={newAccess} 
              onChange={(e) => setNewAccess(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addAccessRecord} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Record</button>
            <ul className="text-gray-600 text-left space-y-2">
              {accessRecords.map(record => (
                <li key={record.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>🔒 <strong>{record.user}:</strong> {record.action} (<span className="text-blue-600">{record.status}</span>)</span>
                </li>
              ))}
            </ul>
          </div>
        
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Audit & Security Incident Logs</h2>
            <input 
              type="text" 
              placeholder="Enter new security log" 
              value={newSecurityEvent} 
              onChange={(e) => setNewSecurityEvent(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={addSecurityLog} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full mb-4">Add Log</button>
            <ul className="text-gray-600 text-left space-y-2">
              {securityLogs.map(log => (
                <li key={log.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>⚠️ <strong>{log.event}</strong> (<span className={log.severity === "Critical" ? "text-red-600" : "text-yellow-600"}>{log.severity}</span>)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition mt-8 block mx-auto"
        >
          Learn More
        </motion.button>
      </motion.div>
    </div>
  );
}
