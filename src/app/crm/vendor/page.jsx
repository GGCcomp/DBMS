"use client";
import { useEffect, useState } from "react";

export default function Page() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const getTicket = async () => {
            const res = await fetch("/api/ticketService/vendor");
            const data = await res.json();
            console.log(data);

            if (data.success) {
                setTickets(data.tickets);
            }
        };
        getTicket();
    }, []);

    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Vendor Tickets
                </h1>

                {tickets && tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="p-6 mb-6 border border-gray-300 rounded-lg shadow-sm transition-all hover:bg-gray-100"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{ticket.subject}</h2>
                            <p className="text-gray-600">
                                <strong>Status:</strong> {ticket.status}
                            </p>
                            <p className="text-gray-600">
                                <strong>Vendor:</strong> {ticket.vendorEmail.split('<')[0].trim()}
                                <br />
                                <strong>Email:</strong> {ticket.vendorEmail.split('<')[1].replace('>', '').trim()}
                            </p>

                        </div>
                    ))
                ) : (
                    <p className="text-center text-xl text-gray-600">No tickets found.</p>
                )}
            </div>
        </div>
    );
}
