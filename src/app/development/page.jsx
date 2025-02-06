'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsArrowLeftRight } from "react-icons/bs";

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
                    className="text-5xl font-extrabold mb-6 flex justify-evenly py-2"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Link href='/tech'>Technology</Link>
                    <span><BsArrowLeftRight/></span>
                    <Link href='/development' className='underline underline-offset-4'>Development</Link>
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
                        <h2 className="text-2xl font-semibold mb-4">Release Overview</h2>
                        <p>Build scalable, secure, and robust IT systems for your business.</p>
                        <Link
                            href="/development/releaseOverview"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Repo Version Control</h2>
                        <p>Implement security measures and manage access control effectively.</p>
                        <Link
                            href="/development/repoVersionControl"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Security Compliance</h2>
                        <p>Ensure your systems are running smoothly with dedicated support.</p>
                        <Link
                            href="/development/securityCompliance"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Api Integration Repo</h2>
                        <p>Build custom solutions with expert development services.</p>
                        <Link
                            href="/development/apiRepo"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">CI CD Tracking</h2>
                        <p>Build scalable, secure, and robust IT systems for your business.</p>
                        <Link
                            href="/development/CICDTracking"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>


                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Testing QA Reports</h2>
                        <p>Build scalable, secure, and robust IT systems for your business.</p>
                        <Link
                            href="/development/testingQAReport"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">DevOps & Access Control</h2>
                        <p>Build scalable, secure, and robust IT systems for your business.</p>
                        <Link
                            href="/development/devOps"
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition"
                        >
                            Learn More &rarr;
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg p-8 shadow-lg text-gray-800 hover:scale-105 transform transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Knowledge Base & Collaboration Hub</h2>
                        <p>Build scalable, secure, and robust IT systems for your business.</p>
                        <Link
                            href="/development/knowledgeBase"
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
                        href="/development/dataEntry"
                        className="bg-pink-500 text-white px-6 py-3 mr-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
                    >
                        Data Entry
                    </Link>
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
