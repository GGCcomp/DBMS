'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
          <Link href='/tech' className='underline underline-offset-4'>Technology</Link>
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
              href="/tech/itInfrastructure"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">IT Support & Helpdesk</h2>
            <p>Implement security measures and manage access control effectively.</p>
            <Link
              href="/tech/itSupport"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          {/* <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Identity & Access Management</h2>
            <p>Ensure your systems are running smoothly with dedicated support.</p>
            <Link
              href="/tech/accessManagement"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div> */}

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Cyber Security</h2>
            <p>Build custom solutions with expert development services.</p>
            <Link
              href="/tech/cyberSecurity"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Network Management</h2>
            <p>Build scalable, secure, and robust IT systems for your business.</p>
            <Link
              href="/tech/networkManagement"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>


          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">IT Governance</h2>
            <p>Build scalable, secure, and robust IT systems for your business.</p>
            <Link
              href="/tech/itGovernance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div>

          {/* <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Disaster Recovery</h2>
            <p>Build scalable, secure, and robust IT systems for your business.</p>
            <Link
              href="/tech/recovery"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Learn More &rarr;
            </Link>
          </motion.div> */}

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Communication & Collaboration</h2>
            <p>Build scalable, secure, and robust IT systems for your business.</p>
            <Link
              href="/tech/communication"
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

export default Page;
