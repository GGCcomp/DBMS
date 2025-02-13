"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AttendanceLeaveTracking() {
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 1, employee: "John Doe", date: "2025-02-10", status: "Present" },
    { id: 2, employee: "Jane Smith", date: "2025-02-10", status: "Absent" },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: "Alice Brown", type: "Sick Leave", status: "Approved" },
    { id: 2, employee: "Bob Johnson", type: "Annual Leave", status: "Pending" },
  ]);

  const [workLogs, setWorkLogs] = useState([
    { id: 1, employee: "Charlie Green", hours: 8, date: "2025-02-09" },
    { id: 2, employee: "David White", hours: 6, date: "2025-02-09" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Attendance & Leave Tracking
        </h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Manage attendance, leave applications, and work logs seamlessly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Logs */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Attendance Logs</h2>
            <ul className="text-gray-600 text-left space-y-2">
              {attendanceLogs.map((log) => (
                <li key={log.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>
                    📅 <strong>{log.employee}</strong> - {log.date} (
                    <span className={log.status === "Present" ? "text-green-600" : "text-red-600"}>{log.status}</span>
                    )
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leave Management */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Leave Management</h2>
            <ul className="text-gray-600 text-left space-y-2">
              {leaveRequests.map((leave) => (
                <li key={leave.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>
                    🏖 <strong>{leave.employee}</strong> - {leave.type} (
                    <span className={leave.status === "Approved" ? "text-green-600" : "text-yellow-600"}>{leave.status}</span>
                    )
                  </span>
                </li>
              ))}
            </ul>
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
