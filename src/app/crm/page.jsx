"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Toaster, toast } from 'sonner';

export default function Page() {
  const route = useRouter();
  const [tickets, setTickets] = useState({
    Open: [],
    Unresolved: [],
    Resolved: [],
    "In Progress": [],
    Closed: []
  });
  const [agents, setAgents] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setModalOpen] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    email: "",
    subject: "",
    source: "",
    priority: "",
    group: "",
    agent: "",
    department: "",
    product: "",
    message: "",
    reference: "",
    tags: [],
    lastInteraction: new Date().toISOString(),
  });

  const getAgents = async (dep) => {
    try {
      const res = await fetch(`/api/ticketService/agents?department=${dep}`);
      const data = await res.json();
      if (res.ok) {
        setAgents(data.agents);
      } else {
        console.error("Error fetching agents:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  // 🔹 Fetch tickets from the backend
  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/ticketService/ticket");
        const data = await res.json();
        if (data.success) {
          const groupedTickets = {
            Open: [],
            Unresolved: [],
            Resolved: [],
            "In Progress": [],
            Closed: []
          };
          data.tickets.forEach((ticket) => {
            groupedTickets[ticket.status]?.push(ticket);
          });
          setTickets(groupedTickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    }
    fetchTickets();
  }, []);

  // 🔹 Handle moving tickets between statuses
  const handleMoveTicket = async (ticket, fromTab, toTab) => {
    try {
      const res = await fetch("/api/ticketService/ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket._id, newStatus: toTab }),
      });

      const data = await res.json();
      if (data.success) {
        setTickets((prev) => {
          const updatedFrom = prev[fromTab].filter((t) => t._id !== ticket._id);
          const updatedTo = [...prev[toTab], data.ticket];

          toast.success("Ticket Status Updated!");
          return { ...prev, [fromTab]: updatedFrom, [toTab]: updatedTo };
        });
      }
    } catch (error) {
      toast.error("Error in updating the status!");
      console.error("Error updating ticket status:", error);
    }
    setModalOpen(null);
  };

  const handleTagChange = (e) => {
    setNewTicket({ ...newTicket, tags: e.target.value.split(",") });
  };

  // 🔹 Create a new ticket
  const handleCreateTicket = async () => {
    if (newTicket.subject.trim() === "" || newTicket.email.trim() === "") return;

    try {
      const res = await fetch("/api/ticketService/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newTicket.email,
          subject: newTicket.subject,
          source: newTicket.source,
          priority: newTicket.priority,
          group: newTicket.group,
          agentId: newTicket.agent,
          department: newTicket.department,
          product: newTicket.product,
          message: newTicket.message,
          reference: newTicket.reference,
          tags: newTicket.tags,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTickets((prev) => ({
          ...prev,
          Open: [...prev.Open, data.ticket],
        }));
        setNewTicket({
          email: "", subject: "",
          source: "",
          priority: "",
          group: "",
          agent: "",
          product: "",
          message: "",
          reference: "",
          tags: [],
          lastInteraction: new Date().toISOString()
        });
        toast.success("Ticket Created!");
        setCreateModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to Created!");
      console.error("Error creating ticket:", error);
    }
  };

  const allTickets = Object.values(tickets).flat();
  const displayedTickets = activeTab === "All" ? allTickets : tickets[activeTab];

  const chartData = Object.keys(tickets).map((status) => ({
    name: status,
    count: tickets[status].length,
  }));

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen text-white">
      <Toaster richColors={true} position="bottom-right" visibleToasts={1} />
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
      <div className="flex gap-3">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md mb-4" onClick={() => setCreateModalOpen(true)}>Create Ticket</button>
        <button className="px-4 py-2 bg-gray-300 rounded-md text-black mb-4" onClick={() => route.push('/crm/reminder')}>Pending</button>
        <button className="px-4 py-2 bg-gray-300 rounded-md text-black mb-4" onClick={() => route.push('/crm/vendor')}>Vendor</button>
        <button className="px-4 py-2 bg-gray-300 rounded-md text-black mb-4" onClick={() => route.push('/crm/contacts')}>Contacts</button>
        <button className="px-4 py-2 bg-gray-300 rounded-md text-black mb-4" onClick={() => route.push('/thread')}>Threads</button>
        <button className="px-4 py-2 bg-gray-300 rounded-md text-black mb-4" onClick={() => route.push('/crm/ticket/insights')}>Insights</button>
      </div>

      {/* Tickets List */}
      <ul className="border p-4 rounded-md bg-gray-100 text-black">
        {displayedTickets.map((ticket) => (
          <li
            key={ticket._id}
            className="p-2 bg-white mb-2 shadow rounded-md cursor-pointer"
            onClick={() => setModalOpen(ticket)}
          >
            <p className="font-bold">{ticket.subject}</p>
            <p className="text-sm text-gray-600 truncate">{ticket.message || "No description"}</p>
          </li>
        ))}
      </ul>

      {/* Chart */}
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
            <h3 className="text-xl font-bold mb-2">Subject: {isModalOpen.subject}</h3>
            <p className="text-gray-700">Desc: {isModalOpen.message || "No description available."}</p>
            <p className="text-gray-700">Status: {isModalOpen.status}</p>
            <p className="text-gray-700">Agent: {isModalOpen.agentId.name}</p>
            <p className="text-gray-700">Priority: {isModalOpen.priority}</p>
            <p className="text-gray-700">Product: {isModalOpen.product}</p>

            {activeTab !== "All" && activeTab !== "Closed" && (
              <>
                <p className="mt-4">Move Ticket:</p>
                <div className="flex gap-2 mt-2">
                  {Object.keys(tickets).map((tab) => {
                    if (tab !== activeTab) {
                      if (tab === "Closed" && isModalOpen.status !== "Resolved") return null;

                      return (
                        <button
                          key={tab}
                          className="bg-gray-300 px-2 py-1 rounded-md"
                          onClick={() => handleMoveTicket(isModalOpen, activeTab, tab)}
                        >
                          Move to {tab}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}

            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setModalOpen(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 ">
          <div className="bg-white p-6 rounded-lg text-black w-2/4 shadow-lg h-[85vh] overflow-y-scroll">
            <h3 className="text-2xl font-bold mb-4 text-center">Create New Ticket</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter email"
                  value={newTicket.email}
                  onChange={(e) => setNewTicket({ ...newTicket, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter ticket subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter source (Email, Chat, Phone)"
                  value={newTicket.source}
                  onChange={(e) => setNewTicket({ ...newTicket, source: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  className="border rounded-md p-2 w-full"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Group</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    placeholder="Enter group name"
                    value={newTicket.group}
                    onChange={(e) => setNewTicket({ ...newTicket, group: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select
                    value={newTicket.department}
                    onChange={async (e) => {
                      const selectedDepartment = e.target.value;
                      setNewTicket({ ...newTicket, department: selectedDepartment });
                      await getAgents(selectedDepartment);
                    }}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="">Select Department</option>
                    <option value="Development">Development</option>
                    <option value="IT">IT</option>
                    <option value="Compliance">Compliance</option>
                    <option value="CyberSecurity">CyberSecurity</option>
                    <option value="Sales">Sales</option>
                    <option value="Research">Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Assign to Agent</label>
                  <select value={newTicket.agent} onChange={(e) => setNewTicket({ ...newTicket, agent: e.target.value })}
                    className="border rounded-md p-2 w-full">
                    <option value="">Select an agent</option>
                    {agents && agents.map((agent, i) => <option key={i} value={agent._id}>{agent.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter product name"
                  value={newTicket.product}
                  onChange={(e) => setNewTicket({ ...newTicket, product: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter ticket description"
                  rows="4"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Reference</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    placeholder="Enter reference (if any)"
                    value={newTicket.reference}
                    onChange={(e) => setNewTicket({ ...newTicket, reference: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    placeholder="Enter tags (comma-separated)"
                    value={newTicket.tags.join(", ")}
                    onChange={handleTagChange}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Last Interaction: {new Date(newTicket.lastInteraction).toLocaleString()}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full mr-2"
                  onClick={handleCreateTicket}
                >
                  Create Ticket
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition w-full"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
