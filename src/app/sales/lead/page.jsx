"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Page() {
  const [leads, setLeads] = useState([
    { source: "Website", count: 120 },
    { source: "Campaigns", count: 80 },
    { source: "Referrals", count: 50 },
  ]);

  const [leadStatus, setLeadStatus] = useState([
    { status: "New", count: 60 },
    { status: "Contacted", count: 40 },
    { status: "In Negotiation", count: 20 },
    { status: "Won", count: 15 },
    { status: "Lost", count: 10 },
  ]);

  const [clientProfiles, setClientProfiles] = useState([
    { company: "ABC Corp", transactions: 5, lastInteraction: "2025-02-10" },
    { company: "XYZ Ltd", transactions: 3, lastInteraction: "2025-02-08" },
  ]);

  const [communicationLogs, setCommunicationLogs] = useState([
    { client: "ABC Corp", type: "Email", date: "2025-02-10" },
    { client: "XYZ Ltd", type: "Call", date: "2025-02-08" },
  ]);

  const [followUps, setFollowUps] = useState([
    { client: "ABC Corp", nextMeeting: "2025-02-15" },
    { client: "XYZ Ltd", nextMeeting: "2025-02-18" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-xl max-w-4xl w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📊 Lead Management Dashboard</h1>

        {/* Lead Repository */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Lead Repository</h2>
          <ul className="mt-2 list-disc pl-5">
            {leads.map((lead, index) => (
              <li key={index}>{lead.source}: {lead.count}</li>
            ))}
          </ul>
        </div>

        {/* Lead Lifecycle Tracking */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Lead Lifecycle Tracking</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leadStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Client Profiles */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Client Profiles</h2>
          <ul className="mt-2 list-disc pl-5">
            {clientProfiles.map((client, index) => (
              <li key={index}>{client.company} - Transactions: {client.transactions}, Last Interaction: {client.lastInteraction}</li>
            ))}
          </ul>
        </div>

        {/* Communication Logs */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Communication Logs</h2>
          <ul className="mt-2 list-disc pl-5">
            {communicationLogs.map((log, index) => (
              <li key={index}>{log.client} - {log.type} on {log.date}</li>
            ))}
          </ul>
        </div>

        {/* Sales Follow-Up Reminders */}
        <div className="p-4 bg-red-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Sales Follow-Up Reminders</h2>
          <ul className="mt-2 list-disc pl-5">
            {followUps.map((followUp, index) => (
              <li key={index}>{followUp.client} - Next Meeting: {followUp.nextMeeting}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
