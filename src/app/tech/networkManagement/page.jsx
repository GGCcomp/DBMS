"use client"
import { useState } from "react";

export default function Page() {
  const [vpnLogs, setVpnLogs] = useState([
    { id: 1, type: "VPN Access", user: "John Doe", status: "Connected" },
    { id: 2, type: "Remote Desktop", user: "Alice Smith", status: "Failed" },
  ]);

  const [firewallLogs, setFirewallLogs] = useState([
    { id: 1, type: "Firewall Rule Change", details: "Blocked port 8080", status: "Updated" },
    { id: 2, type: "Intrusion Attempt", details: "Unauthorized access detected", status: "Critical" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newLog, setNewLog] = useState({ type: "", user: "", status: "" });
  const [editingLog, setEditingLog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [logType, setLogType] = useState("vpn"); // 'vpn' or 'firewall'

  const openModal = (log = null, type) => {
    setEditingLog(log);
    setLogType(type);
    setNewLog(log || { type: "", user: "", status: "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingLog) {
      if (logType === "vpn") {
        setVpnLogs(vpnLogs.map(log => (log.id === editingLog.id ? newLog : log)));
      } else {
        setFirewallLogs(firewallLogs.map(log => (log.id === editingLog.id ? newLog : log)));
      }
    } else {
      const newEntry = { ...newLog, id: Date.now() };
      if (logType === "vpn") {
        setVpnLogs([...vpnLogs, newEntry]);
      } else {
        setFirewallLogs([...firewallLogs, newEntry]);
      }
    }
    setModalOpen(false);
  };

  const handleDelete = (id, type) => {
    if (type === "vpn") {
      setVpnLogs(vpnLogs.filter(log => log.id !== id));
    } else {
      setFirewallLogs(firewallLogs.filter(log => log.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4 text-white">Network & Connectivity Management</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search logs..."
        className="p-2 w-full rounded-lg mb-4 border border-gray-300"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* VPN & Remote Access Logs */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">VPN & Remote Access Logs</h2>
          <button onClick={() => openModal(null, "vpn")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Log</button>
        </div>
        <table className="w-full mt-2 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Type</th>
              <th className="p-2">User</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vpnLogs
              .filter(log => log.type.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(log => (
                <tr key={log.id} className="border-t">
                  <td className="p-2">{log.type}</td>
                  <td className="p-2">{log.user}</td>
                  <td className="p-2">{log.status}</td>
                  <td className="p-2">
                    <button onClick={() => openModal(log, "vpn")} className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2">Edit</button>
                    <button onClick={() => handleDelete(log.id, "vpn")} className="bg-red-500 text-white px-3 py-1 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Firewall & Intrusion Logs */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Firewall & Intrusion Logs</h2>
          <button onClick={() => openModal(null, "firewall")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Log</button>
        </div>
        <table className="w-full mt-2 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Type</th>
              <th className="p-2">Details</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {firewallLogs
              .filter(log => log.type.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(log => (
                <tr key={log.id} className="border-t">
                  <td className="p-2">{log.type}</td>
                  <td className="p-2">{log.details}</td>
                  <td className="p-2">{log.status}</td>
                  <td className="p-2">
                    <button onClick={() => openModal(log, "firewall")} className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2">Edit</button>
                    <button onClick={() => handleDelete(log.id, "firewall")} className="bg-red-500 text-white px-3 py-1 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Logs */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">{editingLog ? "Edit Log" : "Add New Log"}</h2>
            <input
              className="p-2 w-full rounded-md mb-2 border"
              type="text"
              placeholder="Type"
              value={newLog.type}
              onChange={(e) => setNewLog({ ...newLog, type: e.target.value })}
            />
            <input
              className="p-2 w-full rounded-md mb-2 border"
              type="text"
              placeholder="Details/User"
              value={newLog.user || newLog.details}
              onChange={(e) => setNewLog({ ...newLog, user: e.target.value })}
            />
            <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
