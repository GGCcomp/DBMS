"use client";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const initialTickets = {
  Open: [{ id: 1, title: "Fix login issue", description: "Users are unable to log in due to session timeout issue." }],
  Unresolved: [],
  Overdue: [],
  "Due Today": [],
  "On Hold": [],
  Unassigned: [],
};

export default function Page() {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setModalOpen] = useState(null);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleMoveTicket = (ticket, fromTab, toTab) => {
    setTickets((prev) => {
      const updatedFrom = prev[fromTab].filter((t) => t.id !== ticket.id);
      const updatedTo = [...prev[toTab], ticket];
      return { ...prev, [fromTab]: updatedFrom, [toTab]: updatedTo };
    });
  };

  const handleCreateTicket = () => {
    if (newTicket.title.trim() === "") return;
    setTickets((prev) => ({
      ...prev,
      Open: [...prev.Open, { id: Date.now(), ...newTicket }],
    }));
    setNewTicket({ title: "", description: "" });
    setCreateModalOpen(false);
  };

  const allTickets = Object.values(tickets).flat();
  const displayedTickets = activeTab === "All" ? allTickets : tickets[activeTab];

  const chartData = Object.keys(tickets).map((status) => ({
    name: status,
    count: tickets[status].length,
  }));

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Dashboard & Ticket Overview</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "All" ? "bg-white text-black" : "bg-gray-300 text-black"}`}
          onClick={() => setActiveTab("All")}
        >
          All ({allTickets.length})
        </button>
        {Object.keys(tickets).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md ${activeTab === tab ? "bg-white text-black" : "bg-gray-300 text-black"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} ({tickets[tab].length})
          </button>
        ))}
      </div>

      {/* Create Ticket Button */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => setCreateModalOpen(true)}
      >
        Create Ticket
      </button>

      {/* Tickets List */}
      <ul className="border p-4 rounded-md bg-gray-100 text-black">
        {displayedTickets.map((ticket) => (
          <li
            key={ticket.id}
            className="p-2 bg-white mb-2 shadow rounded-md cursor-pointer"
            onClick={() => setModalOpen(ticket)}
          >
            <p className="font-bold">{ticket.title}</p>
            <p className="text-sm text-gray-600 truncate">{ticket.description || "No description"}</p>
          </li>
        ))}
      </ul>

      {/* Chart (Always Shown) */}
      <div className="mt-6 bg-white p-4 rounded-md">
        <h2 className="text-lg font-bold mb-2 text-black">Trends & Analytics</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-black w-2/4">
            <h3 className="text-xl font-bold mb-2">{isModalOpen.title}</h3>
            <p className="text-gray-700">{isModalOpen.description || "No description available."}</p>

            {/* Hide move options in "All" tab */}
            {activeTab !== "All" && (
              <>
                <p className="mt-4">Move Ticket:</p>
                <div className="flex gap-2 mt-2">
                  {Object.keys(tickets).map(
                    (tab) =>
                      tab !== activeTab && (
                        <button
                          key={tab}
                          className="bg-gray-300 px-2 py-1 rounded-md"
                          onClick={() => {
                            handleMoveTicket(isModalOpen, activeTab, tab);
                            setModalOpen(null);
                          }}
                        >
                          Move to {tab}
                        </button>
                      )
                  )}
                </div>
              </>
            )}

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => setModalOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-black w-96">
            <h3 className="text-xl font-bold mb-2">Create New Ticket</h3>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Enter ticket title"
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            />
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Enter ticket description"
              rows="3"
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleCreateTicket}
            >
              Create
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
