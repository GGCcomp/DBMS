"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const [insights, setInsights] = useState({});
  const [agents, setAgents] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch("/api/ticketService/insights").then(res => res.json()).then(setInsights);
    fetch("/api/ticketService/agents/agent-performance").then(res => res.json()).then(data => setAgents(data.agents));
    fetch("/api/ticketService/trending").then(res => res.json()).then(data => setTrending(data.trendingIssues));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Insights</h1>
      
      {/* Resolution Insights */}
      <motion.div className="bg-white p-4 rounded-md shadow-md mt-4" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2 className="text-xl font-semibold">Resolution Insights</h2>
        <p>Total Tickets: {insights.totalTickets}</p>
        <p>Resolved Tickets: {insights.resolvedTickets}</p>
        <p>Average Resolution Time: {Math.round(insights.avgResolutionTime / 1000 / 60)} mins</p>
      </motion.div>

      {/* Agent Performance */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Agent Performance</h2>
        {agents.map(agent => (
          <motion.div key={agent._id} className="bg-gray-100 p-2 rounded-md mt-2">
            <p>{agent.name} - {agent.ticketsAssigned} Ticket Assigned - {agent.ticketsResolved} Tickets Resolved</p>
          </motion.div>
        ))}
      </div>

      {/* Trending Issues */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Trending Issues</h2>
        {trending.map(issue => (
          <motion.div key={issue._id} className="bg-yellow-100 p-2 rounded-md mt-2">
            <p>{issue._id} - {issue.count} Reports</p>
          </motion.div>
        ))}
      </div>

      {/* Export Button */}
      <Link href="/api/ticketService/export-csv">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Export Reports</button>
      </Link>
    </div>
  );
}
