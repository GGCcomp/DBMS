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
          Operations
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Manage processes, resources, and logistics effectively.
        </motion.p>

        {/* Operations Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Process Management</h2>
            <p>Optimize and streamline internal processes for efficiency.</p>
            <Link
              href="/operations/process-management"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Resource Allocation</h2>
            <p>Ensure optimal allocation of resources for maximum output.</p>
            <Link
              href="/operations/resource-allocation"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Logistics & Scheduling</h2>
            <p>Efficiently manage logistics and scheduling operations.</p>
            <Link
              href="/operations/logistics-scheduling"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Vendor Management</h2>
            <p>Build strong partnerships and manage vendor relationships.</p>
            <Link
              href="/operations/vendor-management"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Quality Control</h2>
            <p>Ensure the quality of products and services through systematic checks.</p>
            <Link
              href="/operations/quality-control"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <Link
            href="/"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default page;
