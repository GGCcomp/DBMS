"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Page() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([
    { id: 1, title: "How to reset your VPN connection" },
    { id: 2, title: "Common IT troubleshooting questions" },
    { id: 3, title: "IT security compliance checklist" },
  ]);

  const [editKB, setEditKB] = useState(null);
  const [kbInput, setKbInput] = useState("");
  const { data: session, status } = useSession();
  const [statusGroups, setStatusGroups] = useState({
    Open: [],
    Unresolved: [],
    Resolved: [],
    "In Progress": [],
    Closed: [],
  });

  const [selectedTicket, setSelectedTicket] = useState(null); // For modal
  const [updatedStatus, setUpdatedStatus] = useState(""); // For status change

  useEffect(() => {
    if (status === 'authenticated') {
      getTickets();
    }
  }, [status]);

  const getTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ticketService/ticket?department=${session.user.department}`);
      const data = await res.json();
      const filteredTickets = data.tickets.filter(ticket => ticket.status !== "Closed");
      setTickets(filteredTickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false)
    }
  };

  // Open Modal
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setUpdatedStatus(ticket.status); // Set current status in dropdown
  };

  // Close Modal
  const closeModal = () => setSelectedTicket(null);




  const updateTicketStatus = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/ticketService/ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket._id, newStatus: updatedStatus }),
      });

      const data = await res.json();

      if (data.success) {
        getTickets();
        closeModal();
        // Refresh the ticket list or update state accordingly
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating ticket status:", err);
    } finally {
      setLoading(false);
    }
  };

  const editKnowledgeItem = (id) => {
    setEditKB(id);
    const item = knowledgeBase.find(kb => kb.id === id);
    setKbInput(item.title);
  };

  const saveKnowledgeItem = (id) => {
    setKnowledgeBase(knowledgeBase.map(kb =>
      kb.id === id ? { ...kb, title: kbInput } : kb
    ));
    setEditKB(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">IT Support & Helpdesk</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">A comprehensive section for managing employee support and troubleshooting.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Request Tracking</h2>
            {loading ? (
              <p className='text-center py-3'>Loading...</p>
            ) : tickets && tickets.length > 0 ? (
              <ul className="text-gray-600 text-left space-y-2">
                {tickets.map(ticket => (
                  <li
                    key={ticket._id}
                    className="flex justify-between items-center bg-white p-3 rounded shadow cursor-pointer"
                    onClick={() => openModal(ticket)}
                  >
                    <span>
                      📌 <strong>{ticket.message}</strong>
                      (<span className={ticket.status === "Resolved" ? "text-green-600" : "text-yellow-600"}>
                        {ticket.status}
                      </span>)
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-center py-3'>No tickets yet.</p>
            )}


            {/* Modal for Ticket Details */}
            {selectedTicket && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
                  <p><strong>Assigned To:</strong> {selectedTicket.agentId.name}</p>
                  <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                  <p><strong>Message:</strong> {selectedTicket.message}</p>
                  <p><strong>Priority:</strong> {selectedTicket.priority}</p>
                  <p><strong>Source:</strong> {selectedTicket.source}</p>
                  <p><strong>Last Interaction:</strong> {new Date(selectedTicket.lastInteraction).toLocaleString()}</p>

                  {/* Status Update Dropdown */}
                  {selectedTicket.status !== "Closed" && <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Change Status:</label>
                    <select
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                      className="border rounded-md p-2 w-full"
                    >
                      {Object.keys(statusGroups)
                        .filter(status => status !== "Closed") // Excludes "Closed"
                        .map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </div>}


                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    {selectedTicket.agentId?.name !== session.user.name ? <button
                      onClick={updateTicketStatus}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      disabled={loading || selectedTicket.status === "Closed"}
                    >
                      {loading ? "Updating..." : "Update Status"}
                    </button> : <p className='bg-red-500 text-white px-4 py-2 rounded'>Not Assigned to you</p>}
                    <button
                      onClick={closeModal}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Knowledge Base & Self-Service</h2>
            <ul className="text-gray-600 text-left space-y-2">
              {knowledgeBase.map(kb => (
                <li key={kb.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                  {editKB === kb.id ? (
                    <input
                      type="text"
                      value={kbInput}
                      onChange={(e) => setKbInput(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <span>📖 <strong>{kb.title}</strong></span>
                  )}
                  {editKB === kb.id ? (
                    <button onClick={() => saveKnowledgeItem(kb.id)} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                  ) : (
                    <button onClick={() => editKnowledgeItem(kb.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  )}
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
