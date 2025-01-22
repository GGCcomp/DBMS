'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col justify-center items-center text-white">
      <motion.div
        className="w-full max-w-7xl px-8 py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-6"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to the HR Portal
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Streamline HR processes, manage employee relations, and access crucial services all in one place.
        </motion.p>

        {/* HR Categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Employee Relations */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Employee Relations</h2>
            <p>Handle employee engagement, communication, and collaboration efficiently.</p>
            <Link
              href="/hr/employee-relations"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Manage Relations &rarr;
            </Link>
          </motion.div>

          {/* Feedback & Grievances */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Feedback & Grievances</h2>
            <p>Submit feedback or raise grievances anonymously and securely.</p>
            <Link
              href="/hr/feedback-grievances"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Submit Feedback &rarr;
            </Link>
          </motion.div>

          {/* Leave & Attendance */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Leave & Attendance</h2>
            <p>Track your attendance and apply for leaves seamlessly.</p>
            <Link
              href="/hr/leave-attendance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              View Details &rarr;
            </Link>
          </motion.div>

          {/* Payroll & Benefits */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Payroll & Benefits</h2>
            <p>Access payroll details, benefits, and tax breakdowns securely.</p>
            <Link
              href="/hr/payroll-benefits"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Explore Payroll & Benefits &rarr;
            </Link>
          </motion.div>
        </motion.div>

        {/* Button Section */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-5"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <Link
            href="/hr/services"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Explore All HR Services
          </Link>

          <Link
            href="/hr/data-entry"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Data Entry
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default page;
