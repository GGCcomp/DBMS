"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", type: "customer" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const res = await fetch("/api/ticketService/contacts");
    const data = await res.json();
    if (data.success) setContacts(data.data);
  };

  const handleFavorite = async (id) => {
    await fetch("/api/ticketService/contacts", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    });
    fetchContacts();
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    const res = await fetch(`/api/ticketService/contacts/search?search=${e.target.value}`);
    const data = await res.json();
    if (data.success) setContacts(data.data);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    await fetch("/api/ticketService/contacts", {
      method: "POST",
      body: JSON.stringify(newContact),
    });
    setNewContact({ name: "", email: "", phone: "", type: "customer" });
    fetchContacts();
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <h1 className="text-3xl font-bold text-white text-center mb-6">CRM Contact Directory</h1>

      {/* Add Contact Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Contact</h2>
        <form onSubmit={handleAddContact} className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" required className="border p-2 rounded" 
            value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
          <input type="email" placeholder="Email" className="border p-2 rounded" 
            value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} />
          <input type="text" placeholder="Phone" className="border p-2 rounded" 
            value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
          <select className="border p-2 rounded" value={newContact.type} 
            onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="partner">Partner</option>
            <option value="employee">Employee</option>
          </select>
          <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Contact
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <input type="text" placeholder="Search contacts..." className="border p-3 rounded w-full mb-4" 
        value={search} onChange={handleSearch} />

      {/* Contact Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse shadow-lg rounded-lg bg-white">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Type</th>
              <th className="p-3">Favorite</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border-t hover:bg-gray-100 transition">
                <td className="p-3">{contact.name}</td>
                <td className="p-3">{contact.email || "N/A"}</td>
                <td className="p-3">{contact.phone || "N/A"}</td>
                <td className="p-3">{contact.type}</td>
                <td className="p-3">
                  <button onClick={() => handleFavorite(contact._id)} className="text-yellow-500 text-lg">
                    {contact.isFavorite ? "★" : "☆"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
