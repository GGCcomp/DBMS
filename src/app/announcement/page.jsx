"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSession } from "next-auth/react";

function Page() {
    const [announceLoading, setAnnounceLoading] = useState(false);
    const [error, setError] = useState('');
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementDate, setAnnouncementDate] = useState('');
    const { data: session } = useSession();
    
    const handleAnnouncement = async () => {
        if (!announcementText || !announcementDate) {
          setError('All fields are required for announcements.');
          return;
        }
    
        setError('');
        setAnnounceLoading(true);
        try {
          const res = await fetch('/api/announcement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: announcementText, department: session.user.department ,role: session.user.role, date: announcementDate, creator: session.user.name }),
          });
    
          if (res.ok) {
            setAnnouncementText('');
              setAnnouncementDate('');
            let res = await fetch('/api/notifications/announcement', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title: "From Admin", body: 'A new annoucement is made!', link: 'http://localhost:3000/' })
            });
            res = await res.json();
          } else {
            setError('Failed to add announcement.');
          }
        } catch (error) {
          console.error(error);
          setError('Something went wrong.');
        } finally {
          setAnnounceLoading(false);
        }
      };

    return (
        <div className='h-[90vh] flex flex-col px-4 justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500'>
            <h1 className="text-3xl font-bold mb-6 text-white">Create New Announcement</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <motion.div
            className="bg-white w-full rounded-lg p-6 shadow-lg text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
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
                    {announceLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                        'Add Announcement'
                    )}
                </button>
            </div>
        </motion.div>
        </div>
    )
}

export default Page