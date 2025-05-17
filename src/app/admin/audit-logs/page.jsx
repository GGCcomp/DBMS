"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [logs, setLogs] = useState([]);
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT_INITIAL = 12;
  const LIMIT_LOAD_MORE = 5;

  const buildURL = (limit, skipVal = 0) => {
    const url = new URL("/api/audit-log", window.location.origin);
    if (userId) url.searchParams.append("userId", userId);
    if (action) url.searchParams.append("action", action);
    if (startDate && endDate) {
      url.searchParams.append("startDate", startDate);
      url.searchParams.append("endDate", endDate);
    }
    url.searchParams.append("limit", limit);
    url.searchParams.append("skip", skipVal);
    return url;
  };

  const fetchLogs = async (reset = true) => {
    const url = buildURL(LIMIT_INITIAL, 0);
    const res = await fetch(url);
    const data = await res.json();

    if (reset) {
      setLogs(data.logs || []);
      setSkip(data.logs.length);
    }
    setHasMore((data.logs || []).length >= LIMIT_INITIAL);
  };

  const loadMoreLogs = async () => {
    const url = buildURL(LIMIT_LOAD_MORE, skip);
    const res = await fetch(url);
    const data = await res.json();

    if (data.logs?.length) {
      setLogs((prev) => [...prev, ...data.logs]);
      setSkip((prev) => prev + data.logs.length);
      if (data.logs.length < LIMIT_LOAD_MORE) setHasMore(false);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchLogs(true);
  }, []);

  return (
    <div className="p-4 h-screen overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search User ID"
          className="border p-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <select
          className="border p-2"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">All Actions</option>
          <option value="Login">Login</option>
          <option value="Logout">Logout</option>
          <option value="Data Update">Data Update</option>
          <option value="Download">Download</option>
          <option value="Upload">Upload</option>
          <option value="PunchIn">Punch In</option>
          <option value="PunchOut">Punch Out</option>
        </select>
        <input
          type="date"
          className="border p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2"
          onClick={() => fetchLogs(true)}
        >
          Search
        </button>
      </div>

      {/* Logs Table Container */}
      <div className="overflow-y-auto border rounded-md h-[60vh]">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Action</th>
              <th className="py-2 px-4 border">Details</th>
              <th className="py-2 px-4 border">IP Address</th>
              <th className="py-2 px-4 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border">
                <td className="py-2 px-4 border">{log.user?.name}</td>
                <td className="py-2 px-4 border">{log.user?.department}</td>
                <td className="py-2 px-4 border">{log.user?.role}</td>
                <td className="py-2 px-4 border">{log.action}</td>
                <td className="py-2 px-4 border">{log.details}</td>
                <td className="py-2 px-4 border">{log.ipAddress}</td>
                <td className="py-2 px-4 border">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-700"
            onClick={loadMoreLogs}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
