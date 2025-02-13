'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsArrowLeftRight } from "react-icons/bs";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col justify-center items-center text-white">
      <motion.div
        className="w-full max-w-7xl px-8 py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-6 flex justify-evenly py-2"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <Link href='/sales' className='underline underline-offset-4'>Sales</Link>
          <span className=''><BsArrowLeftRight /></span>
          <Link href='/marketing'>Marketing</Link>
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Streamline Sales processes, manage sales insights, and access crucial services all in one place.
        </motion.p>

        {/* HR Categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Sales Overview & Analytics</h2>
            <p>Provides insights into sales performance and revenue trends.</p>
            <Link
              href="/sales/overview"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Overview & Analytics &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Lead & Client Relationship Management</h2>
            <p>Stores and manages leads and customer data.</p>
            <Link
              href="/sales/lead"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
             Lead & Client &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Sales Pipeline & Deal Documentation</h2>
            <p>Tracks and structures Deal progress.</p>
            <Link
              href="/sales/pipeline-devlopment"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Pipeline & Deal Documentation &rarr;
            </Link>
          </motion.div>

          {/* Payroll & Benefits */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Product & Pricing Documentation</h2>
            <p>Stores fintech product details and pricing strategies.</p>
            <Link
              href="/sales/pricing-documentation"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Pricing Documentation &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Payment & Revenue Tracking</h2>
            <p>Documents sales-related payments and financial records.</p>
            <Link
              href="/sales/payment-revenue"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Payment & Revenue &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Performance & Compliance Monitoring</h2>
            <p>Ensures compliance with fintech regulations and sales efficiency</p>
            <Link
              href="/sales/performance-compliance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Compliance Monitoring &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Sales Strategy & Insights Repository</h2>
            <p>Stores resources to improve sales approaches</p>
            <Link
              href="/sales/strategy-insights"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Insights Repository &rarr;
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
            href="/sales/data-entry"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Data Entry
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;
