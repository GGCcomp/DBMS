"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  const [workLogs, setWorkLogs] = useState([
    { id: 1, employee: "Charlie Green", hours: 8, date: "2025-02-09" },
    { id: 2, employee: "David White", hours: 6, date: "2025-02-09" },
  ]);

  useEffect(() => {
    const getAttendanceLog = async () => {
      setLoading(true);
      let url = new URL('/api/audit-log', window.location.origin);

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.logs);
          
          setAttendanceLogs(data.logs || []);
        })
        .catch((error) => console.error("Error fetching filtered logs:", error));
    }
    getAttendanceLog();
  }, []);

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

  const attendanceResults = useMemo(() => {
    const userAttendance = {};
  
    attendanceLogs.forEach((log) => {
      const date = new Date(log.timestamp).toISOString().split("T")[0]; // Extract YYYY-MM-DD
      const userKey = `${log.userId}-${date}`;
  
      if (!userAttendance[userKey]) {
        userAttendance[userKey] = { logins: [], logouts: [], details: null };
      }
  
      if (log.action === "LOGIN") {
        userAttendance[userKey].logins.push(new Date(log.timestamp));
        if (!userAttendance[userKey].details) {
          userAttendance[userKey].details = log.details; // Store first login message as details
        }
      } else if (log.action === "LOGOUT") {
        userAttendance[userKey].logouts.push(new Date(log.timestamp));
      }
    });
  
    return Object.keys(userAttendance).map((key) => {
      const { logins, logouts, details } = userAttendance[key];
      const [userId, date] = key.split("-");
  
      if (logins.length === 0 || logouts.length === 0) {
        return { userId, details, date, status: "Absent", firstLogin: null, lastLogout: null };
      }
  
      logins.sort((a, b) => a - b);
      logouts.sort((a, b) => a - b);
  
      const firstLogin = logins[0];
      const lastLogout = logouts[logouts.length - 1];
  
      const timeDiff = (lastLogout - firstLogin) / (1000 * 60 * 60); // Convert ms to hours
      const status = timeDiff >= 6 ? "Present" : "Absent";
  
      return { userId, details, date, status, firstLogin, lastLogout };
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
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Attendance Logs</h2>
            <ul className="text-gray-600 text-left space-y-2">
              {attendanceResults.length > 0 ? (
                attendanceResults.map((record, i) => (
                  <li key={i} className="bg-white p-3 rounded shadow flex flex-col">
                    <span>
                      📅 <strong>{record.details}</strong> -
                      <span className={record.status === "Present" ? "text-green-600" : "text-red-600"}> {record.status}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      ⏰ First Login: {record.firstLogin ? new Date(record.firstLogin).toLocaleTimeString() : "N/A"} |
                      Last Logout: {record.lastLogout ? new Date(record.lastLogout).toLocaleTimeString() : "N/A"}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500">No Attendance Records Found</li>
              )}
            </ul>
          </div>

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
                        🏖 <strong>{leave.name}</strong> - {leave.reason} (
                        <span className={leave.status === "Approved" ? "text-green-600" : "text-yellow-600"}>
                          {leave.approval}
                        </span>
                        )
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500">No Leave data</li>
                )}
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
