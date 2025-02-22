"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnnouncementModal from "@/components/AnnouncementModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSession } from "next-auth/react";

function Page() {
  const [announcements, setAnnouncements] = useState(null);
  const [create, setCreate] = useState(false);
  const [openAnnModal, setOpenAnnModal] = useState(false);
  const [annData, setAnnData] = useState({});
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [error, setError] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementDate, setAnnouncementDate] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/announcement");
        const data = await res.json();
        setAnnouncements(data.announcement);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleAnnouncement = async () => {
    if (!announcementText || !announcementDate) {
      setError("All fields are required for announcements.");
      return;
    }

    setError("");
    setAnnounceLoading(true);
    try {
      const res = await fetch("/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: announcementText,
          department: session.user.department,
          role: session.user.role,
          date: announcementDate,
          creator: session.user.name,
        }),
      });

      if (res.ok) {
        setAnnouncementText("");
        setAnnouncementDate("");
        await fetch("/api/notifications/announcement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "From Admin",
            body: "A new announcement has been made!",
            link: "http://localhost:3000/",
          }),
        });
      } else {
        setError("Failed to add announcement.");
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
      setError("Something went wrong.");
    } finally {
      setAnnounceLoading(false);
    }
  };

  const openAnnouncementModal = (date, text, name, department, role) => {
    setAnnData({ date, text, name, department, role });
    setOpenAnnModal(true);
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <motion.h2
        className="text-3xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Announcements
      </motion.h2>

      <motion.div
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Announcement</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Creator</th>
            </tr>
          </thead>
          <tbody>
            {announcements?.map((announcement, i) => {
              const formattedDate = new Date(announcement.date).toLocaleDateString("en-GB").replace(/\//g, "-");
              return (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => openAnnouncementModal(formattedDate, announcement.text, announcement.creator, announcement.department, announcement.role)}
                >
                  <td className="px-4 py-2">{formattedDate}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{announcement.text}</td>
                  <td className="px-4 py-2">{announcement.department}</td>
                  <td className="px-4 py-2">{announcement.creator}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {session && session?.user?.permission && <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setCreate(!create)}>
          Create Announcement
        </button>}
      </motion.div>

      {create && session?.user?.permission && (
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Create New Announcement</h1>
            <button className="text-red-500" onClick={() => setCreate(false)}>X</button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <textarea
            placeholder="Enter announcement text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring focus:ring-blue-300"
          ></textarea>
          <div className="flex gap-4">
            <input
              type="date"
              value={announcementDate}
              onChange={(e) => setAnnouncementDate(e.target.value)}
              className="border px-4 py-3 rounded-lg focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleAnnouncement}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              disabled={announceLoading}
            >
              {announceLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Add Announcement"}
            </button>
          </div>
        </motion.div>
      )}
      {openAnnModal && <AnnouncementModal onClose={() => setOpenAnnModal(false)} data={annData} />}
    </div>
  );
}

export default Page;
