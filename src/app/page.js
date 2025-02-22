'use client';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Home() {
  const {data: session} = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-white text-center p-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold leading-tight sm:text-6xl"
        >
          Powerful Fintech MIS
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-lg sm:text-xl max-w-2xl"
        >
          Manage your financial operations seamlessly with real-time insights and secure data processing.
        </motion.p>
        <motion.a 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          href={session?.user?.department ? `/${session.user.department.toLowerCase()}` : "/login"} 
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold text-lg rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          {session?.user?.department ? session.user.department : "Login"}
        </motion.a>
      </section>
    </div>
  );
}

