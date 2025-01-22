import { useState } from "react";

function LeaveEdit({ data, onClose, isUpdated }) {
  const [formData, setFormData] = useState({
    reason: data.reason || "",
    fromDate: formatDateForInput(data.fromDate) || "",
    toDate: formatDateForInput(data.toDate) || "",
  });

  const today = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

  // Helper function to format MM/DD/YYYY to YYYY-MM-DD
  function formatDateForInput(date) {
    const [month, day, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const res = await fetch(`/api/leave_req/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          fromDate: new Date(formData.fromDate).toLocaleDateString("en-US"),
          toDate: new Date(formData.toDate).toLocaleDateString("en-US"),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        console.log("Success!");
        isUpdated(true);
        onClose(); 
      } else {
        console.log("Failed to update:", result.message);
      }
    } catch (err) {
      console.error("Error updating leave request:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-black">
        <h2 className="text-xl font-semibold mb-4">Edit Leave Request</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="reason">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Enter the reason for leave"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="fromDate">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              min={today} // Restrict to current date onwards
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="toDate">
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              min={formData.fromDate || today} // Ensure toDate is after or on fromDate
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveEdit;
