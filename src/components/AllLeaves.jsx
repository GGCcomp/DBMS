'use client';
import { useEffect, useState } from 'react';

function AllLeaves({ onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');

  useEffect(() => {
    const getAllLeaves = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/leave_req');
        if (!res.ok) {
          throw new Error('Failed to fetch leave data');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching leave data:', err);
      } finally {
        setLoading(false);
      }
    };

    getAllLeaves();
  }, []);

  // Filter leaves based on approval and search input
  const filteredLeaves = data
    .filter((leave) => leave.approval === 'approved')
    .filter((leave) => {
      const nameMatch = leave.name.toLowerCase().includes(searchName.toLowerCase());
      const roleMatch = leave.role.toLowerCase().includes(searchRole.toLowerCase());
      return nameMatch && roleMatch;
    });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[80%] sm:w-[60%] lg:w-[40%] p-6 rounded-lg overflow-auto">
        <div className="flex justify-between px-4 items-center">
          <h1 className="text-xl font-semibold">Employee Leaves</h1>
          <button className="text-red-500 p-5 rounded-lg font-semibold" onClick={onClose}>
            X
          </button>
        </div>

        {/* Search Filters */}
        <div className="my-4">
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Search by Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Search by Role</label>
              <input
                id="role"
                type="text"
                placeholder="Enter role"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredLeaves.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Role: (Department)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">From</th>
                <th className="border border-gray-300 px-4 py-2 text-left">To</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-4 py-2">{leave.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{leave.role}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No approved leave data available!</p>
        )}
      </div>
    </div>
  );
}

export default AllLeaves;
