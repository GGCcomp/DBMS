import { useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeDocuments from './EmployeeDocuments';
import EditEmployeeForm from './EditEmployeeForm';

export default function EmployeeCard({ employee, reload }) {
    const [showModal, setShowModal] = useState(false);

    const removeEmpHandler = async (id, documents) => {
        const confirmed = window.confirm("Are you sure you want to remove this employee?");
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/hr/employee`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    filesToRemove: documents || [],
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Employee removed successfully.");
                // Optionally refetch the employee list or update local state
            } else {
                alert(data.error || "Failed to remove employee.");
            }
        } catch (err) {
            console.error("Error deleting employee:", err);
            alert("Something went wrong.");
        }
    };


    return (
        <motion.div
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {showModal && (
                <EditEmployeeForm employee={employee} onClose={() => setShowModal(false)} reload={reload} />
            )}

            <div className="mb-4">
                <div className='flex justify-between items-center'>
                    <h3 className="text-2xl font-bold text-purple-700 mb-1">{employee.name}</h3>
                    <button className='text-red-600 hover:text-red-600 text-xs' onClick={() => removeEmpHandler(employee._id, employee.documents)}>Remove Employee</button>
                </div>
                <p className="text-sm text-gray-500">Role: <span className="text-gray-700 font-medium">{employee.employment.title}</span></p>
                <p className="text-sm text-gray-500">Department: <span className="text-gray-700 font-medium">{employee.employment.department}</span></p>
            </div>

            <div className="space-y-1 mb-4 text-sm text-gray-600">
                <p>📞 <span className="font-medium">{employee.profile.contact}</span></p>
                <p>🚨 Emergency: <span className="font-medium">{employee.profile.emergency}</span></p>
                <p>🏦 Bank: <span className="font-medium">
                    {employee.profile.bank?.name || 'N/A'}<br />
                    Account No: {employee.profile.bank?.accountNo || 'N/A'}<br />
                    Branch: {employee.profile.bank?.branch || 'N/A'}<br />
                    IFSC: {employee.profile.bank?.IFSC || 'N/A'}
                </span></p>

            </div>

            <div className="mt-4">
                <EmployeeDocuments documents={employee.documents} />
            </div>

            <div className="mt-6 text-center">
                {showModal && <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r mr-4 from-purple-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                >
                    Close
                </button>}
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                >
                    ✏️ Edit Employee
                </button>
            </div>
        </motion.div>
    );
}
