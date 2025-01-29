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
          Welcome to the Financial Portal
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Manage budgets, streamline payments, ensure tax compliance, and gain financial insights all in one place.
        </motion.p>

        {/* Financial Categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Budget Management */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Budget Management</h2>
            <p>Plan and track budgets to optimize financial performance.</p>
            <Link
              href="/finance/budget-management"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Manage Budgets &rarr;
            </Link>
          </motion.div>

          {/* Payments & Invoicing */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Payments & Invoicing</h2>
            <p>Effortlessly handle transactions and generate invoices.</p>
            <Link
              href="/finance/payments-invoicing"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Explore Payments &rarr;
            </Link>
          </motion.div>

          {/* Tax Compliance */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Tax Compliance</h2>
            <p>Stay compliant with tax regulations and simplify filings.</p>
            <Link
              href="/finance/tax-compliance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Manage Compliance &rarr;
            </Link>
          </motion.div>

          {/* Financial Analytics */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Financial Analytics</h2>
            <p>Gain insights with detailed analytics and performance metrics.</p>
            <Link
              href="/finance/financial-analytics"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              View Analytics &rarr;
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
            href="/finance/services"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Explore All Financial Services
          </Link>

          <Link
            href="/finance/reports"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            View Reports
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default page;
