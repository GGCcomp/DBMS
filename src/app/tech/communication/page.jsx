"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from 'next-auth/react';

export default function Page() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportLogs, setSupportLogs] = useState([]);
  const { data: session, status } = useSession();

  // const [feedback, setFeedback] = useState([
  //   { id: 1, name: "John Doe", message: "Great IT support, very responsive!" },
  //   { id: 2, name: "Jane Smith", message: "Need faster response times during outages." }
  // ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", details: "", type: "" });

  const getAnnouncement = async() => {
    try{
      setLoading(true);
      let res = await fetch("/api/tech/announcement");
      res = await res.json();      
      setAnnouncements(res.announcements);
    }catch(err){
      console.log(err);
      
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncement();
  },[]);

  useEffect(() => {
    if (status === 'authenticated') {
      const getLogs = async () => {
        try {
          const res = await fetch(`/api/ticketService/ticket?status=Resolved,Closed&department=${session.user.department}`);
          const data = await res.json();
          console.log(data.tickets);
          
          setSupportLogs(data.tickets);
        } catch (err) {
          console.log(err);
        }
      };
      getLogs();
    }
  }, [status]);
  

  const openModal = () => {
    setNewEntry({ title: "", details: "", type: "" });
    setModalOpen(true);
  };

  const handleSave = async() => {
    try{
      setLoading(true);
      let res = await fetch("/api/tech/announcement",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: newEntry })
      });
      if(res.ok){
        getAnnouncement();
        setModalOpen(false);
      }
    }
    catch(err){
      console.log(err); 
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-white">
      <motion.h1 className="text-4xl font-extrabold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        📢 Communication & Collaboration Hub
      </motion.h1>

      {/* Announcements */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">IT Announcements & Alerts</h2>
          <button onClick={() => openModal(null, "announcement")} className="bg-pink-500 text-white px-6 py-3 mb-2 rounded-lg hover:bg-pink-600 transition">+ Add</button>
        </div>
       {announcements && announcements.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map(a => (
            <motion.div key={a.id} className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:scale-95 transition">
              <h3 className="text-xl font-bold">{a.title}</h3>
              <p className="text-gray-200">{a.details}</p>
              <p className="text-sm text-gray-300">{a.type}</p>
              <p className="text-sm text-gray-300">Created at: {new Date(a.createdAt).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>: <p className="text-center text-white text-xl p-3">No Announcements.</p>}
      </div>

      {/* Support Logs */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Live IT Support Logs</h2>
        </div>
        {supportLogs && supportLogs.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportLogs.map(s => (
            <motion.div key={s.id} className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:scale-95 transition">
              <h3 className="text-xl font-bold">Resolved By: {s.agentId.name}</h3>
              <p className="text-gray-200">{s.details}</p>
              <p className="text-gray-200">{s.status}</p>
              <p className="text-gray-200">Product: {s.product}</p>
              <p className="text-gray-200">Issue: {s.subject}</p>
              <p className="text-sm text-gray-300">{new Date(s.createdAt).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div> : <p className="text-white text-xl p-3">No Logs yet.</p>}
      </div>

      {/* Feedback */}
      {/* <div>
        <h2 className="text-2xl font-semibold">Employee Feedback & Surveys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map(f => (
            <motion.div key={f.id} className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:scale-95 transition">
              <h3 className="text-xl font-bold">{f.name}</h3>
              <p className="text-gray-200">{f.message}</p>
            </motion.div>
          ))}
        </div>
      </div> */}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div className="bg-white p-6 rounded-lg w-96 shadow-xl text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4">Add New Entry</h2>
            <input type="text" placeholder="Title" className="w-full p-2 mb-3 border border-gray-300 rounded" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} />
            <textarea placeholder="Details" className="w-full p-2 mb-3 border border-gray-300 rounded" value={newEntry.details} onChange={(e) => setNewEntry({ ...newEntry, details: e.target.value })} />
              <select className="w-full p-2 mb-3 border border-gray-300 rounded" value={newEntry.type} onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}>
                <option value="">Select type</option>
                <option value="Alert">Alert</option>
                <option value="Security">Security</option>
              </select>
            <div className="flex justify-between">
              <button onClick={() => setModalOpen(false)} className="text-gray-500">Cancel</button>
              <button onClick={handleSave} className="bg-pink-500 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
