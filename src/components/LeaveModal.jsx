import React, { useState, useEffect } from "react";

function LeaveModal({ onClose, name, role, email }) {
  const [leaves, setLeaves] = useState([]);
  const [leaveData, setLeaveData] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
    name,
    role,
    email,
  });

  const [currentDate, setCurrentDate] = useState("");

  // Update current date state on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setCurrentDate(today);
    setLeaveData((prevData) => ({
      ...prevData,
      fromDate: today, // Set current date as default "fromDate"
    }));
  }, []);

  // Fetch leaves data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/leave_req/" + email);
        const data = await res.json();
        setLeaves(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getData();
  }, [email]);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/leave_req", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveData),
      });
      await response.json();
      if (response.ok) {
        alert("Leave Request submitted successfully");
        onClose(); // Close modal after successful submission
      } else {
        alert("Failed to submit leave data");
      }
    } catch (err) {
      console.log("Error submitting leave data:", err);
    }
  };

  // Determine if the form should be shown
  const showForm =
    leaves.length === 0 || // No leaves exist
    leaves.every((leave) => leave.toDate < currentDate || leave.approval === "rejected"); // All leaves expired or rejected

  // Get the active leave status message
  const activeLeaveMessage = leaves.some(
    (leave) =>
      leave.approval === "approved" && leave.toDate >= currentDate
  )
    ? "You already have an approved leave."
    : leaves.some((leave) => leave.approval === "requested")
    ? "Your leave request is pending."
    : null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[80%] sm:w-[60%] lg:w-[40%] p-6 rounded-lg overflow-auto">
        {leaves.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Leave Status</h2>
            <div className="mb-4 text-black">
              <strong>Applied Leaves:</strong> {leaves.length} &nbsp; | &nbsp;
              <strong>Approved:</strong>{" "}
              {leaves.filter((leave) => leave.approval === "approved").length}{" "}
              &nbsp; | &nbsp;
              <strong>Rejected:</strong>{" "}
              {leaves.filter((leave) => leave.approval === "rejected").length}
            </div>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">From</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">To</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, index) => (
                  <tr key={index} className="text-black">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-semibold ${
                        leave.approval === "approved"
                          ? "text-green-600"
                          : leave.approval === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {leave.approval}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Show form or message based on conditions */}
        {showForm ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-black">Request Leave</h2>
            <form onSubmit={handleSubmit} className="text-black">
              {/* Form fields */}
              <div className="mb-4">
                <label htmlFor="reason" className="block text-gray-700 text-xl font-semibold">
                  Reason For Leave
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={leaveData.reason}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                ></textarea>
              </div>

              <div className="mb-4 flex space-x-4">
                <div className="w-full">
                  <label htmlFor="fromDate" className="block text-gray-700">
                    From Date
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={leaveData.fromDate}
                    onChange={handleChange}
                    min={currentDate}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="toDate" className="block text-gray-700">
                    To Date
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={leaveData.toDate}
                    onChange={handleChange}
                    min={currentDate}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-black rounded-md mr-4 hover:bg-gray-400 transition duration-300"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-yellow-600">
              {activeLeaveMessage}
            </h2>
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveModal;
