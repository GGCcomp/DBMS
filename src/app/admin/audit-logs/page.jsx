"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [logs, setLogs] = useState([]);
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLogs = async () => {
    let url = new URL('/api/audit-log', window.location.origin);
    if (userId) url.searchParams.append("userId", userId);
    if (action) url.searchParams.append("action", action);
    if (startDate && endDate) {
        url.searchParams.append("startDate", startDate);
        url.searchParams.append("endDate", endDate);
    }

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log("Filtered Logs:", data);
            setLogs(data.logs);
        })
        .catch((error) => console.error("Error fetching filtered logs:", error));
};

useEffect(() => {
    fetchLogs();
}, []);

  return (
    <div className="p-4 h-screen">
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <input 
          type="text" placeholder="Search User ID" 
          className="border p-2" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
        />
        <select className="border p-2" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="DATA_UPDATE">Data Update</option>
          <option value="EXPORT">Export</option>
          <option value="PUNCH_IN">Punch In</option>
          <option value="PUNCH_OUT">Punch Out</option>
        </select>
        <input type="date" className="border p-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="border p-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" onClick={fetchLogs}>Search</button>
      </div>

      {/* Logs Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">User</th>
            <th className="py-2 px-4 border">Action</th>
            <th className="py-2 px-4 border">Details</th>
            <th className="py-2 px-4 border">IP Address</th>
            <th className="py-2 px-4 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs && logs.map((log) => (
            <tr key={log._id} className="border">
              <td className="py-2 px-4 border">{log.userId}</td>
              <td className="py-2 px-4 border">{log.action}</td>
              <td className="py-2 px-4 border">{log.details || "N/A"}</td>
              <td className="py-2 px-4 border">{log.ipAddress}</td>
              <td className="py-2 px-4 border">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
