'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import Modal from './Modal';


export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState('');
  const { data: session } = useSession();

  const roles = ['Development', 'Analyst', 'Marketing', 'Sales', 'HR'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, invitationsRes, leaveRequestsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/invitations'),
          fetch('/api/leave_req'),
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (invitationsRes.ok) setInvitations(await invitationsRes.json());
        if (leaveRequestsRes.ok) setLeaveRequests(await leaveRequestsRes.json());
      } catch (error) {
        setError('Failed to fetch data.');
        console.error(error);
      }
    };

    fetchData();
  }, []);


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
        body: JSON.stringify({ email, role }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Invitation sent successfully!');
        setInvitations((prev) => [...prev, { email, role, expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }]);
        setEmail('');
        setRole('');
      } else {
        setError(result.error || 'Failed to send invitation.');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleAnnouncement = async () => {
    if (!announcementText || !announcementDate) {
      setError('All fields are required for announcements.');
      return;
    }

    setError('');
    setAnnounceLoading(true);
    try {
      const res = await fetch('/api/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: announcementText, role: session.user.role, date: announcementDate, creator: session.user.name }),
      });

      if (res.ok) {
        alert('Announcement added successfully!');
        setAnnouncementText('');
        setAnnouncementDate('');
      } else {
        setError('Failed to add announcement.');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong.');
    } finally {
      setAnnounceLoading(false);
    }
  };

  const openModal = (title, data, type = '') => {
    setModalTitle(title);
    setModalData(data);
    setIsModalOpen(true);
    setModalType(type); // Add this state for type
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Admin Panel</h1>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer"
            onClick={() => openModal('Total Employees', users, 'Total Employees')}
          >
            <h2 className="text-xl font-semibold text-gray-700">Total Employees</h2>
            <p className="text-3xl font-bold text-blue-500">{users.length}</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer"
            onClick={() => openModal('Invitations Sent', invitations, 'Invitations Sent')}
          >
            <h2 className="text-xl font-semibold text-gray-700">Invitations Sent</h2>
            <p className="text-3xl font-bold text-blue-500">{invitations.length}</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer"
            onClick={() => openModal('Leave Requests', leaveRequests, 'leaveRequests')}
          >
            <h2 className="text-xl font-semibold text-gray-700">Leave Requests</h2>
            <p className="text-3xl font-bold text-blue-500">{leaveRequests.length}</p>
          </div>

        </div>

        {/* Invitation Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Send Registration Invitation</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full md:w-auto border px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
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
              className="flex-grow border px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            />

            <button
              onClick={handleInvite}
              className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              disabled={inviteLoading}
            >
              {inviteLoading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : <FiSend className="mr-2" />}
              {inviteLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create Announcement</h2>
          <textarea
            placeholder="Enter announcement text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring focus:ring-blue-300"
          ></textarea>
          <div className="flex gap-4">
            <input
              type="date"
              value={announcementDate}
              onChange={(e) => setAnnouncementDate(e.target.value)}
              className="border px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleAnnouncement}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              disabled={announceLoading}
            >
              {announceLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Add Announcement'}
            </button>
          </div>
        </div>

        {/* Modal for displaying data */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalTitle}
          data={modalData}
          type={modalType}
        />
      </div>
    </div>
  );
}
