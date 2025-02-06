"use client"
import { useState } from "react";

export default function page() {
  const [changeLogs, setChangeLogs] = useState([
    { id: 1, type: "Software Update", details: "Updated OS to version 11.2", status: "Completed" },
    { id: 2, type: "Configuration Change", details: "Modified firewall rules", status: "Pending" },
  ]);

  const [policyDocs, setPolicyDocs] = useState([
    { id: 1, title: "IT Usage Policy", description: "Defines employee IT usage rules", status: "Active" },
    { id: 2, title: "Backup Schedule", description: "Weekly data backup schedule", status: "Updated" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({ title: "", details: "", status: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [entryType, setEntryType] = useState("changeLog");

  const openModal = (item = null, type) => {
    setEditingItem(item);
    setEntryType(type);
    setNewEntry(item || { title: "", details: "", status: "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      if (entryType === "changeLog") {
        setChangeLogs(changeLogs.map(log => (log.id === editingItem.id ? newEntry : log)));
      } else {
        setPolicyDocs(policyDocs.map(doc => (doc.id === editingItem.id ? newEntry : doc)));
      }
    } else {
      const newItem = { ...newEntry, id: Date.now() };
      entryType === "changeLog" ? setChangeLogs([...changeLogs, newItem]) : setPolicyDocs([...policyDocs, newItem]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id, type) => {
    type === "changeLog"
      ? setChangeLogs(changeLogs.filter(log => log.id !== id))
      : setPolicyDocs(policyDocs.filter(doc => doc.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">IT Governance & Change Management</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search logs or policies..."
        className="p-3 w-full rounded-lg mb-6 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Change Management Logs */}
      <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Change Management Logs</h2>
          <button
            onClick={() => openModal(null, "changeLog")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Add Log
          </button>
        </div>
        <table className="w-full mt-4 border-collapse text-gray-800">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-3">Type</th>
              <th className="p-3">Details</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {changeLogs
              .filter(log => log.type.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(log => (
                <tr key={log.id} className="border-t">
                  <td className="p-3">{log.type}</td>
                  <td className="p-3">{log.details}</td>
                  <td className="p-3">{log.status}</td>
                  <td className="p-3">
                    <button onClick={() => openModal(log, "changeLog")} className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 transition mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(log.id, "changeLog")} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Policy & Compliance Documentation */}
      <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Policy & Compliance Documentation</h2>
          <button
            onClick={() => openModal(null, "policyDoc")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Add Policy
          </button>
        </div>
        <table className="w-full mt-4 border-collapse text-gray-800">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policyDocs
              .filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(doc => (
                <tr key={doc.id} className="border-t">
                  <td className="p-3">{doc.title}</td>
                  <td className="p-3">{doc.description}</td>
                  <td className="p-3">{doc.status}</td>
                  <td className="p-3">
                    <button onClick={() => openModal(doc, "policyDoc")} className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 transition mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(doc.id, "policyDoc")} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Logs & Policies */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
            <h2 className="text-2xl font-bold mb-4">{editingItem ? "Edit Entry" : "Add New Entry"}</h2>
            <input
              className="p-3 w-full rounded-md mb-3 border"
              type="text"
              placeholder="Title/Type"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            />
            <input
              className="p-3 w-full rounded-md mb-3 border"
              type="text"
              placeholder="Details/Description"
              value={newEntry.details}
              onChange={(e) => setNewEntry({ ...newEntry, details: e.target.value })}
            />
            <button onClick={handleSave} className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition w-full">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
