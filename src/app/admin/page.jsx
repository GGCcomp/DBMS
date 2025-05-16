'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import Modal from './Modal';


export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('');

  const roles = ['Lead', 'Intern'];
  const departments = ["Compliance", "CyberSecurity", "Development", "Human Resource", "Marketing", "Sales", "Tech", "IT-Head", "Marketing-Head"]

  const handleInvite = async () => {
    if (!email || !role) {
      setError('Please provide both email and role.');
      return;
    }

    setError('');
    setInviteLoading(true);
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, department, role }),
      });

      const result = await res.json();
      if (res.ok) {
        setInvitations((prev) => [...prev, { email, role, expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }]);
        setEmail('');
        setDepartment('');
        setRole('');
      } else {
        setError(result.error || 'Failed to send invitation.');
      }
    } catch (error) {
      setError('Something went wrong.');
    } finally {
      setInviteLoading(false);
    }
  };

  const openModal = async (title, type = '') => {
    setModalTitle(title);
    setModalType(type);
    setIsModalOpen(true);
  };



  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col justify-center items-center text-white">
      <motion.div
        className="w-full max-w-7xl px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-center mb-10"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          Admin Panel
        </motion.h1>

        {/* Overview Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => openModal('Total Employees', 'Total Employees')}
          >
            <h2 className="text-2xl font-bold mb-4">Total Employees</h2>
            <p className="text-4xl font-extrabold text-blue-500">5</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => openModal('Invitations Sent', 'Invitations')}
          >
            <h2 className="text-2xl font-bold mb-4">Invitations Sent</h2>
            <p className="text-4xl font-extrabold text-blue-500">9</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => openModal('Leave Requests', 'Leaves')}
          >
            <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
            <p className="text-4xl font-extrabold text-blue-500">0</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Link href='/admin/monitoring'>
              <h2 className="text-2xl font-bold mb-4">Monitoring</h2>
            </Link>
            <Link href="/approvals">
              <h2 className="text-2xl font-bold mb-4">Approval Requests</h2>
            </Link>
            <Link href="/admin/fraud-log">
              <h2 className="text-2xl font-bold mb-4">Fraud Report</h2>
            </Link>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/admin/audit-logs">
              <h2 className="text-2xl font-bold mb-4">Audits</h2>
            </Link>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/crm">
              <h2 className="text-2xl font-bold mb-4">CRM</h2>
            </Link>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/crm/ticket/insights">
              <h2 className="text-2xl font-bold mb-4">Ticket Insights</h2>
            </Link>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg text-gray-800 text-center hover:scale-105 transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/crm/thread">
              <h2 className="text-2xl font-bold mb-4">Threads</h2>
            </Link>
          </motion.div>
        </motion.div>

        {/* Invitation Section */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-lg text-gray-800 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Send Registration Invitation</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full md:w-auto border px-4 py-3 rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full md:w-auto border px-4 py-3 rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow border px-4 py-3 rounded-lg focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleInvite}
              className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              disabled={inviteLoading}
            >
              {inviteLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              ) : (
                <FiSend className="mr-2" />
              )}
              {inviteLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </motion.div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalTitle}
          type={modalType}
        />

      </motion.div>
    </div>
  );
}
