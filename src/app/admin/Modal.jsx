function Modal({ isOpen, onClose, title, data, type }) {
  if (!isOpen) return null;

  const togglePermission = async (userId, currentPermission, event) => {
    try {
      // Optimistic UI Update
      event.target.checked = !currentPermission;

      // Send update request to backend
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: !currentPermission }),
      });

      if (!res.ok) throw new Error("Failed to update permission");
    } catch (error) {
      console.error("Error updating permission:", error);
      // Revert UI if request fails
      event.target.checked = currentPermission;
    }
  };

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
        let res = await fetch('/api/notifications/leave_approval/' + item.email, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: 'Leave Approval!', body: `${item.name} your leave request is ${updatedApproval}`, link: 'http://localhost:3000/'
          }),
        })
        res = await res.json();
        if (res.ok) {
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

  const removeUser = async (id) => {
    try {
      let res = await fetch('/api/users/' + id, {
        method: "DELETE"
      });
      res = await res.json();
      if (res.ok) {
        alert("User Removed!");
      }
    } catch (err) {
      console.log(err);
    }
  }

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
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Name</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Email</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Department</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Role</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Permission</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Leaves</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">Remove</th>
                </tr>
              </thead>
              <tbody>
                {data && data.map((item, index) => {
                  console.log(item)
                  const leaveCount = item.leaves?.length || 0;
                  const leaveDates =
                    leaveCount > 0
                      ? `${formatDate(item.leaves[0].fromDate)} to ${formatDate(item.leaves[0].toDate)}`
                      : "No Leaves";

                  return (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.name}</td>
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.email}</td>
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.department}</td>
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">{item.role}</td>
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.permission}
                            onChange={(e) => togglePermission(item._id, item.permission, e)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer 
                                  peer-checked:after:translate-x-5 peer-checked:after:border-white 
                                  after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
                                  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                  after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
                        {leaveCount > 0 ? `${leaveCount} ${leaveCount > 1 ? 'leaves' : 'leave'}  (${leaveDates})` : "No Leaves"}
                      </td>
                      {item.role !== "admin" && <td className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
                        <button onClick={() => removeUser(item._id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">Remove User</button>
                      </td>}
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
                    {item.approval === "requested" && (
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
