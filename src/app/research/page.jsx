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
          <Link href='/research' className='underline underline-offset-4'>R&D</Link>
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Research & Development services all in one place.
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
            <h2 className="text-2xl font-semibold mb-4">Research Dashboard & Repository</h2>
            <p>Tracks ongoing research, recently added reports, and upcoming initiatives.</p>
            <Link
              href="/research/research-repository"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Research Dashboard &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">AI & Machine Learning Research</h2>
            <p>AI-driven credit risk analysis, fraud detection, and investment forecasting.</p>
            <Link
              href="/research/AI-machinelearning"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
             Machine Learning Research &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Blockchain & Digital Finance Research</h2>
            <p>Research on tokenization, automated lending, and cross-chain interoperability.</p>
            <Link
              href="/research/blockchain"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Digital Finance Research &rarr;
            </Link>
          </motion.div>

          {/* Payroll & Benefits */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Financial Data Analytics</h2>
            <p>Repository of real-time financial data, behavioral analytics, and investment trends.</p>
            <Link
              href="/research/financial-data"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
               Big Data Processing &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Simulation & Risk Analysis</h2>
            <p>Research on risk simulations for fintech portfolios and economic downturn analysis.</p>
            <Link
              href="/research/simulation"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Risk Analysis &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Regulatory Compliance & Ethical AI Research</h2>
            <p>Space for testing new fintech solutions under controlled conditions.</p>
            <Link
              href="/research/regulatory-compliance"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
              Regulatory Compliance &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Cloud-Based Research & Secure Collaboration</h2>
            <p>Secure environment for AI model training and large-scale data analysis.</p>
            <Link
              href="/research/secure-collaboration"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
             Secure Collaboration &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Knowledge Sharing & Research Repository</h2>
            <p>Centralized repository for fintech white papers, research reports, and findings.</p>
            <Link
              href="/research/knowledge-sharing"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
             Research Repository &rarr;
            </Link>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Prototyping & Experimentation</h2>
            <p>Repository for small-scale fintech experiment results.</p>
            <Link
              href="/research/prototyping-experimentation"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
            >
             Prototyping &rarr;
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
            href="/research/data-entry"
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
