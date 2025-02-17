"use client"
import { useEffect, useState } from "react";

function Page() {
  const [pendingTickets, setPendingTickets] = useState([]);

  useEffect(() => {
    async function fetchReminders() {
      const res = await fetch("/api/ticketService/reminder");
      const data = await res.json();
      setPendingTickets(data.tickets);
    }

    fetchReminders();
    const interval = setInterval(fetchReminders, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
      <h2 className="text-lg font-bold text-yellow-700">⏳ Pending Ticket Reminders</h2>
      {pendingTickets.length > 0 ? (
        <ul className="list-disc pl-5">
          {pendingTickets.map((ticket) => (
            <li key={ticket._id} className="text-yellow-900">
              {ticket.subject} (Created: {new Date(ticket.createdAt).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No pending tickets.</p>
      )}
    </div>
  );
}

export default Page;
