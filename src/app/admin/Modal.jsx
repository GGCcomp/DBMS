// Complete and fixed Modal Component
import { useState, useEffect } from "react";

function Modal({ isOpen, onClose, title, type }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit] = useState(10);

  const resetState = () => {
    setData([]);
    setPage(1);
    setTotalPages(1);
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    resetState();
  }, [type, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let res;
        if (type === "Total Employees") {
          res = await fetch(`/api/users?page=${page}&limit=${limit}`, { cache: 'no-store' });
        } else if (type === "Invitations") {
          res = await fetch(`/api/invitations?page=${page}&limit=${limit}`, { cache: 'no-store' });
        } else if (type === "Leaves") {
          res = await fetch(`/api/leave_req?page=${page}&limit=${limit}`, { cache: 'no-store' });
        }

        if (res && res.ok) {
          const result = await res.json();
          if (type === "Total Employees") {
            setData(result.users);
            setTotalPages(result.pagination?.totalPages || 1);
          } else if (type === "Invitations") {
            setData(result.invitations);
            setTotalPages(result.pagination?.totalPages || 1);
          } else if (type === "Leaves") {
            setData(result.leaves);
            setTotalPages(result.pagination?.totalPages || 1);
          }
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        setError("An error occurred.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, page, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 mx-8 w-full overflow-auto max-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <DataTable
            data={data}
            type={type}
            togglePermission={togglePermission}
            removeUser={removeUser}
            handleAction={handleAction}
            formatDate={formatDate}
          />
        )}

        {/* Pagination */}
        {!isLoading && !error && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              Next
            </button>
          </div>
        )}

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

  // --- Utility Functions and Handlers ---
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");
  }

  async function togglePermission(userId, currentPermission, event) {
    try {
      event.target.checked = !currentPermission;
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: !currentPermission }),
      });
      if (!res.ok) throw new Error("Failed to update permission");
    } catch (err) {
      console.error(err);
      event.target.checked = currentPermission;
    }
  }

  async function removeUser(id) {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.ok) setData((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAction(action, item) {
    const approval = action === "Approve" ? "approved" : "rejected";
    try {
      const res = await fetch(`/api/leave_req/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval }),
      });
      if (res.ok) {
        await fetch(`/api/notifications/leave_approval/${item.email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Leave Approval!",
            body: `${item.name} your leave request is ${approval}`,
            link: "http://localhost:3000/",
          }),
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default Modal;

// Split component for table logic by type
function DataTable({ data, type, togglePermission, removeUser, handleAction, formatDate }) {
  if (!data || data.length === 0) return <div className="text-center">No data found.</div>;
  if (type === "Total Employees") {
    return (
      <table className="w-full table-auto border-collapse border border-gray-300 text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Permission</th>
            <th className="border px-4 py-2">Leaves</th>
            <th className="border px-4 py-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.department}</td>
              <td className="border px-4 py-2">{item.role}</td>
              <td className="border px-6 py-3 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.permission}
                    onChange={(e) => togglePermission(item._id, item.permission, e)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-400 rounded-full peer dark:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                </label>
              </td>

              <td className="border px-4 py-2">
                {item.leaves?.length ? `${item.leaves.length} leave(s)` : 'No Leaves'}
              </td>
              <td className="border px-4 py-2">
                {item.role !== 'Admin' && <button onClick={() => removeUser(item._id)} className="text-red-500">Remove</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (type === "Invitations") {
    return (
      <table className="w-full border border-collapse border-gray-300 text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((invite, index) => (
            <tr key={index} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border px-4 py-2">{invite.email}</td>
              <td className="border px-4 py-2">{invite.role}</td>
              <td className="border px-4 py-2">{formatDate(invite.expiryDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (type === "Leaves") {
    return (
      <table className="w-full border border-collapse border-gray-300 text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">From</th>
            <th className="border px-4 py-2">To</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((leave, index) => (
            <tr key={index} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border px-4 py-2">{leave.name}</td>
              <td className="border px-4 py-2">{leave.email}</td>
              <td className="border px-4 py-2">{formatDate(leave.fromDate)}</td>
              <td className="border px-4 py-2">{formatDate(leave.toDate)}</td>
              <td className="border px-4 py-2">{leave.reason}</td>
              <td className="border px-4 py-2">{leave.approval}</td>
              <td className="border px-4 py-2">
                {leave.approval === 'requested' && (
                  <>
                    <button onClick={() => handleAction("Approve", leave)} className="text-green-600">Approve</button>
                    <button onClick={() => handleAction("Reject", leave)} className="ml-2 text-red-600">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
}