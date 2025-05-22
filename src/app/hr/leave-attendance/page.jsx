"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);


  const fetchAttendanceLogs = async (date = selectedDate) => {
  setLogsLoading(true);
  try {
    const url = new URL("/api/audit-log/leave_attendance", window.location.origin);
    url.searchParams.append("date", date);

    const res = await fetch(url);
    const data = await res.json();

    setAttendanceLogs(data.logs || []);
  } catch (error) {
    console.error("Error fetching attendance logs:", error);
  } finally {
    setLogsLoading(false);
  }
};

  useEffect(() => {
    fetchAttendanceLogs(today);
  }, []);


  useEffect(() => {
    const getAllLeaves = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leave_req?page=${page}`);
        if (!res.ok) {
          throw new Error('Failed to fetch leave data');
        }
        const result = await res.json();
        setData(result.leaves);
        setTotalPages(result.pagination.totalPages || 1);
      } catch (err) {
        console.error('Error fetching leave data:', err);
      } finally {
        setLoading(false);
      }
    };

    getAllLeaves();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Attendance & Leave Tracking
        </h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Manage attendance, leave applications, and work logs seamlessly.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {/* Attendance Logs */}
          {logsLoading ? <p className="text-center text-xl text-gray-500">Loading Logs..</p> : <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Attendance Logs</h2>
            <div className="overflow-x-auto">
              <input
                type="date"
                className="border px-3 py-2 rounded mb-4"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  fetchAttendanceLogs(e.target.value);
                }}
              />

              <table className="min-w-full table-auto border border-gray-300 overflow-y-scroll max-h-[70vh]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">First Login</th>
                    <th className="px-4 py-2 text-left">Last Logout</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.length > 0 ? (
                    attendanceLogs.map((rec, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">{rec?.name || "Unknown"}</td>
                        <td className="px-4 py-2">{rec?.department || "—"}</td>
                        <td className="px-4 py-2">{rec.date}</td>
                        <td className="px-4 py-2">
                          {rec.firstLogin ? new Date(rec.firstLogin.createdAt).toLocaleTimeString() : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {rec.lastLogout ? new Date(rec.lastLogout.createdAt).toLocaleTimeString() : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <span className={rec.status === "Present" ? "text-green-600" : "text-red-600"}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                        No Attendance Records Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>}


          {/* Leave Management */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Leave Management</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                {data && data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                      <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Dept</th>
                          <th className="py-3 px-6 text-left">Name</th>
                          <th className="py-3 px-6 text-left">Reason</th>
                          <th className="py-3 px-6 text-left">Status</th>
                          <th className="py-3 px-6 text-left">From</th>
                          <th className="py-3 px-6 text-left">To</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {data.map((leave) => (
                          <tr key={leave.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">{leave.department}</td>
                            <td className="py-3 px-6 text-left">{leave.name}</td>
                            <td className="py-3 px-6 text-left">{leave.reason}</td>
                            <td className={`py-3 px-6 text-left font-semibold ${leave.status === "approved" ? "text-green-600" : "text-yellow-600"}`}>
                              {leave.approval.toUpperCase()}
                            </td>
                            <td className="py-3 px-6 text-left">{new Date(leave.fromDate).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-left">{new Date(leave.toDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No Leave data</p>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg text-white ${page === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Prev
                  </button>
                  <span className="text-sm font-medium self-center">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg text-white ${page === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
