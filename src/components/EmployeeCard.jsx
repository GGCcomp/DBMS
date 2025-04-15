import { useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeDocuments from './EmployeeDocuments';
import EditEmployeeForm from './EditEmployeeForm';

export default function EmployeeCard({ employee }) {
    const [showModal,setShowModal] = useState(false);

    return (
        <motion.div
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {showModal && <EditEmployeeForm employee={employee} onClose={() => setShowModal(false)} />}
            <h3 className="text-xl font-semibold text-blue-600">{employee.name}</h3>
            <p className="text-gray-600">Role: {employee.employment.title}</p>
            <p className="text-gray-600">Department: {employee.employment.department}</p>
            <p className="text-gray-500 text-sm">Contact: {employee.profile.contact}</p>
            <p className="text-gray-500 text-sm">Emergency: {employee.profile.emergency}</p>
            <p className="text-gray-500 text-sm">Bank: {employee.profile.bank}</p>

            {/* Render Iframes for each document */}
            <div className="mt-4">
                <EmployeeDocuments documents={employee.documents} />
            </div>
            <button
                onClick={() => setShowModal(true)}
                className="bg-purple-500 text-white px-6 py-3 rounded-2xl shadow hover:bg-purple-600 transition"
            >
                + Edit Employee
            </button>
        </motion.div>
    );
}
