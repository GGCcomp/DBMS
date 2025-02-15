"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import AllLeaves from "@/components/AllLeaves";
import AnnouncementModal from "@/components/AnnouncementModal";

export default function Page() {
  const { data: session, status } = useSession();
  const [announcements, setAnnouncements] = useState(null);
  const [openAnnModal, setOpenAnnModal] = useState(false);
  const [annData, setAnnData] = useState({});
  const [showLeaves, setShowLeaves] = useState(false);
  const router = useRouter();

  // This will ensure all hooks are always called in the same order during renders
  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        let res = await fetch('/api/announcement');
        res = await res.json();
        setAnnouncements(res.announcement);
      } catch (err) {
        console.log(err);
      }
    };
    getAnnouncements();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const handleAnnData = (date, text, name, role) => {
    setAnnData({date, text, name, role});
    setOpenAnnModal(!openAnnModal);
  }

  // if (status === "loading") {
  //   return <p className="h-[80vh] flex items-center justify-center text-center text-xl font-semibold">Loading...</p>;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 relative border-t border-blue-400">
      {showLeaves && <AllLeaves onClose={() => setShowLeaves(!showLeaves)} />}
      {openAnnModal && <AnnouncementModal onClose={() => setOpenAnnModal(!openAnnModal)} data={annData}/>}
      <main className="py-16 px-8 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Admin',
              'HR',
              'IT',
              'Research',
              'Analyst',
              'Development',
              'ISO',
              'Marketing',
              'Profile',
              'Task & Management',
            ].map((role, i) => (
              <motion.div
                key={role}
                className="p-8 bg-white shadow-lg rounded-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">{role} Portal</h2>
                <p className="text-lg text-gray-600 mb-6">
                  {role === 'Admin'
                    ? 'Access financial reports, metrics, and company performance insights.'
                    : 'Manage your tasks, submit tickets, and access resources.'}
                </p>
                {(
                  <button
                    className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300"
                    onClick={() => router.push(`/${role.toLowerCase()}`)}
                  >
                    Go to {role} Portal
                  </button>
                )}
                {session && session.user.role.toLowerCase() === role.toLowerCase() && (
                  <button
                    className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300"
                    onClick={() => router.push(`/${role.toLowerCase()}`)}
                  >
                    Go to {role} Portal
                  </button>
                )}
              </motion.div>
            ))}
          </section>

          {/* Announcements Section */}
          <section className="mt-16">
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Announcements
            </motion.h2>
            <motion.div
              className="bg-white shadow-lg rounded-xl p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 border-b">Date</th>
                    <th className="px-4 py-2 text-left text-gray-700 border-b">Announcement</th>
                    <th className="px-4 py-2 text-left text-gray-700 border-b">Creator</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements && announcements.map((announcement, i) => {
                    const formattedDate = new Date(announcement.date).toLocaleDateString('en-GB');
                    return (
                      <tr key={i} className="border-b hover:bg-gray-50" onClick={() => handleAnnData(formattedDate.replace(/\//g, '-'),
                        announcement.text, announcement.creator, announcement.role )}>
                        <td className="px-4 py-2 w-2/12">{formattedDate.replace(/\//g, '-')}</td>
                        <td className="px-4 py-2 w-7/12">{announcement.text}</td>
                        <td className="px-4 py-2 w-3/12">
                          {announcement.creator} ({announcement.role})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          </section>

          {/* Quick Links Section */}
          <section className="mt-16">
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Quick Links
            </motion.h2>
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {[
                'Operations',
                'Product',
                'Legal',
                'Finance',
                'Tech',
                'CRM'
              ].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase().replace(/ /g, '')}`}
                  className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300"
                >
                  {link}
                </a>
              ))}
              <button
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300"
                onClick={() => setShowLeaves(!showLeaves)}
              >
                All Leaves
              </button>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white py-6 mt-20 border-t border-blue-400">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2025 Innate Gamma Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
