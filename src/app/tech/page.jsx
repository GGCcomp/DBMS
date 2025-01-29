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
          Technology
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Explore our IT infrastructure, security, development, and support strategies.
        </motion.p>

        {/* Technology Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">IT Infrastructure</h2>
            <p>Build scalable, secure, and robust IT systems for your business.</p>
            <Link
              href="/technology/it-infrastructure"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Security & Access Control</h2>
            <p>Implement security measures and manage access control effectively.</p>
            <Link
              href="/technology/security-access-control"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Maintenance & Support</h2>
            <p>Ensure your systems are running smoothly with dedicated support.</p>
            <Link
              href="/technology/maintenance-support"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Development</h2>
            <p>Build custom solutions with expert development services.</p>
            <Link
              href="/technology/development"
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
