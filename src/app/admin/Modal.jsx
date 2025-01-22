import React from "react";

function Modal({ isOpen, onClose, title, data, type }) {
  if (!isOpen) return null;
  
  // Function to handle approval/rejection actions
  const handleAction = async (action, item) => {
    const updatedApproval = action === "Approve" ? "approved" : "rejected";

    try {
      const response = await fetch(`/api/leave_req/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approval: updatedApproval,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        let res = await fetch('/api/notifications/leave_approval/'+item.email,{
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: 'Leave Approval!', body: `${item.name} your leave request is ${updatedApproval}`, link:'http://localhost:3000/'}),
        })
        res = await res.json();
        if(res.ok){
          onClose();
        }
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  // Function to format dates
  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB"); // dd/mm/yyyy
    return formattedDate.replace(/\//g, "-"); // Replace / with -
  };

  // Check if any items have an approval status of 'requested'
  const shouldShowActionsColumn =
    data && data.some((item) => item.approval === "requested");

  // Return JSX based on the type
  if (type === "Total Employees") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">Leaves</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((item, index) => {
                    const leaveCount = item.leaves?.length || 0;
                    const leaveDates =
                      leaveCount > 0
                        ? `${formatDate(item.leaves[0].fromDate)} to ${formatDate(item.leaves[0].toDate)}`
                        : "No Leaves";

                    return (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.name}</td>
                        <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.email}</td>
                        <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.role}</td>
                        <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
                          {leaveCount > 0 ? `${leaveCount} ${leaveCount > 1 ? 'leaves' : 'leave'}  (${leaveDates})` : "No Leaves"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default JSX rendering for other types (Leave Requests, etc.)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
        <div className="overflow-x-auto max-w-full">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {data &&
                  data.length > 0 &&
                  Object.keys(data[0]).map((key) => {
                    if (key === "_id" || key === "__v") return null; // Skip unwanted keys
                    return (
                      <th
                        key={key}
                        className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    );
                  })}
                {type === "leaveRequests" && shouldShowActionsColumn && (
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {Object.entries(item).map(([key, value], i) => {
                      if (key === "_id" || key === "__v") return null; // Skip unwanted keys

                      const displayValue =
                        (key === "expiryDate" ||
                          key === "fromDate" ||
                          key === "toDate") &&
                        value
                          ? formatDate(value)
                          : typeof value === "object"
                          ? JSON.stringify(value)
                          : value;

                      return (
                        <td
                          key={i}
                          className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700"
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                    {type === "leaveRequests" && item.approval === "requested" && (
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleAction("Approve", item)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction("Reject", item)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
