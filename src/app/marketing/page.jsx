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
          <Link href='/sales'>Sales</Link>
          <span className=''><BsArrowLeftRight /></span>
          <Link href='/marketing' className='underline underline-offset-4'>Marketing</Link>
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Streamline Marketing processes, manage marketing insights, and access crucial services all in one place.
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
            <h2 className="text-2xl font-semibold mb-4">Marketing Overview & Performance Insights</h2>
            <p>Handle marketing operations and insights efficiently.</p>
            <Link
              href="/marketing/marketing-overview"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Marketing Overview &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Customer Segmentation</h2>
            <p>Customer Segmentation & Targeting.</p>
            <Link
              href="/marketing/customer-segmentation"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
             Segmentation &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Digital Marketing & Content Repository</h2>
            <p>Track your attendance and apply for leaves seamlessly.</p>
            <Link
              href="/marketing/digital-marketing"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Digital Marketings &rarr;
            </Link>
          </motion.div>

          {/* Payroll & Benefits */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Campaign Planning</h2>
            <p>Access payroll details, benefits, and tax breakdowns securely.</p>
            <Link
              href="/marketing/campaign-planning"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Campaign Planning &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Marketing Performance & ROI Analysis</h2>
            <p>Marketing Performance & ROI Analysi.</p>
            <Link
              href="/marketing/marketing-performance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Marketing Performance &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Referral & Partner Program Tracking</h2>
            <p>Partner Program Tracking</p>
            <Link
              href="/marketing/referral"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Referral &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Regulatory Marketing Documentation</h2>
            <p>Compliance & Regulatory Marketing Documentation</p>
            <Link
              href="/marketing/compliance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Compliance &rarr;
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
            href="/marketing/data-entry"
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
