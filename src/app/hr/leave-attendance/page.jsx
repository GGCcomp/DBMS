"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const PAGE_LIMIT = 6;

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [workLogs, setWorkLogs] = useState([
    { id: 1, employee: "Charlie Green", hours: 8, date: "2025-02-09" },
    { id: 2, employee: "David White", hours: 6, date: "2025-02-09" },
  ]);

  const fetchAttendanceLogs = async (reset = false) => {
    setLogsLoading(true);
    try {
      const url = new URL("/api/audit-log", window.location.origin);
      url.searchParams.append("limit", PAGE_LIMIT);
      url.searchParams.append("skip", reset ? 0 : skip);

      const res = await fetch(url);
      const data = await res.json();

      if (reset) {
        setAttendanceLogs(data.logs || []);
        setSkip((data.logs || []).length);
      } else {
        setAttendanceLogs((prev) => [...prev, ...(data.logs || [])]);
        setSkip((prev) => prev + (data.logs?.length || 0));
      }

      setHasMore((data.logs || []).length === PAGE_LIMIT);
    } catch (error) {
      console.error("Error fetching attendance logs:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceLogs(true);
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

  const attendanceResults = useMemo(() => {
    const userAttendance = {};

    attendanceLogs.forEach((log) => {
      const dateObj = new Date(log.createdAt);
      if (isNaN(dateObj)) return;

      const date = dateObj.toISOString().split("T")[0];
      const userKey = `${log.user?._id || log.userId}-${date}`;

      if (!userAttendance[userKey]) {
        userAttendance[userKey] = {
          logins: [],
          logouts: [],
          details: log.user,
          date,
        };
      }

      if (log.action === "LOGIN") {
        userAttendance[userKey].logins.push(dateObj);
      } else if (log.action === "LOGOUT") {
        userAttendance[userKey].logouts.push(dateObj);
      }
    });

    return Object.keys(userAttendance).map((key) => {
      const { logins, logouts, details, date } = userAttendance[key];
      const [userId] = key.split("-");

      logins.sort((a, b) => a - b);
      logouts.sort((a, b) => a - b);

      const firstLogin = logins[0] || null;
      const lastLogout = logouts[logouts.length - 1] || null;
      const hoursWorked = firstLogin && lastLogout ? (lastLogout - firstLogin) / (1000 * 60 * 60) : 0;

      return {
        userId,
        date,
        details,
        firstLogin,
        lastLogout,
        status: hoursWorked >= 6 ? "Present" : "Absent",
      };
    });
  }, [attendanceLogs]);

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
              <table className="min-w-full table-auto border border-gray-300">
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
                  {attendanceResults.length > 0 ? (
                    attendanceResults.map((rec, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">{rec.details?.name || "Unknown"}</td>
                        <td className="px-4 py-2">{rec.details?.department || "—"}</td>
                        <td className="px-4 py-2">{rec.date}</td>
                        <td className="px-4 py-2">
                          {rec.firstLogin ? new Date(rec.firstLogin).toLocaleTimeString() : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {rec.lastLogout ? new Date(rec.lastLogout).toLocaleTimeString() : "N/A"}
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

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => fetchAttendanceLogs(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>}


          {/* Leave Management */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Leave Management</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <ul className="text-gray-600 text-left space-y-2">
                {data && data.length > 0 ? (
                  data.map((leave) => (
                    <li key={leave.id} className="bg-white p-3 rounded shadow flex justify-between">
                      <span>
                        🏖 <strong>Dept:</strong>{leave.department}, <strong>Name:</strong>{leave.name}, <strong>Reason</strong>:{leave.reason}, (
                        <span className={leave.status === "approved" ? "text-green-600" : "text-yellow-600"}>
                          Status:{leave.approval.toUpperCase()}
                        </span>,
                        <strong>From:</strong><span>{new Date(leave.fromDate).toLocaleDateString()}</span>,
                        <strong>To:</strong><span>{new Date(leave.toDate).toLocaleDateString()}</span>
                        )
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500">No Leave data</li>
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
              </ul>
            )}

          </div>

          {/* Work Log Submissions */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Work Log Submissions</h2>
            <ul className="text-gray-600 text-left space-y-2">
              {workLogs.map((log) => (
                <li key={log.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>
                    ⏳ <strong>{log.employee}</strong> - {log.hours} hrs on {log.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
