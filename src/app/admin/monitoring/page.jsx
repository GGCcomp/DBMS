"use client";
import { useState, useEffect } from "react";

export default function MonitoringDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // Show 5 deployments per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/monitoring`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      setData(json.data.deployments);
      setTotalPages(Math.ceil(json.data.deployments.length / pageSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Monitoring Dashboard</h2>

      <button
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>

      {error && <p className="text-red-500 mt-3">Error: {error}</p>}

      <div className="mt-4 space-y-4">
        {paginatedData.length === 0 && !loading && <p>No deployments found.</p>}

        {paginatedData.map((deployment) => (
          <div key={deployment.uid} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{deployment.name}</h3>
            <ul>
              <li>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    deployment.state === "READY"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {deployment.state}
                </span>
              </li>
              <li>
                <strong>Deployed At:</strong>{" "}
                {new Date(deployment.created).toLocaleString()}
              </li>
              <li>
                <strong>URL:</strong>{" "}
                <a
                  href={`https://${deployment.url}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {deployment.url}
                </a>
              </li>
              <li>
                <strong>Git Commit:</strong> {deployment.meta.githubCommitMessage}
              </li>
              <li>
                <strong>Deployed By:</strong> {deployment.creator.email}
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
