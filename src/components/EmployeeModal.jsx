import { motion } from 'framer-motion';

export default function EmployeesModal({ onClose }) {


    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const res = await fetch('/api/hr/employee', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            onClose();
        } else {
            alert(data.error || 'Something went wrong');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl"
            >
                <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <input name="name" required placeholder="Full Name" className="w-full p-2 border rounded-xl" />
                    <input name="contact" required placeholder="Contact Number" className="w-full p-2 border rounded-xl" />
                    <input name="emergency" required placeholder="Emergency Contact" className="w-full p-2 border rounded-xl" />
                    <input name="bank" required placeholder="Bank Details" className="w-full p-2 border rounded-xl" />

                    <input name="title" required placeholder="Job Title" className="w-full p-2 border rounded-xl" />
                    <input name="department" required placeholder="Department" className="w-full p-2 border rounded-xl" />
                    <input name="workModel" required placeholder="Work Model (e.g. Remote)" className="w-full p-2 border rounded-xl" />
                    <input name="promotions" multiple placeholder="Promotion History" className="w-full p-2 border rounded-xl" />

                    <input name="benefits" multiple placeholder="Benefits (e.g. Health, PF)" className="w-full p-2 border rounded-xl" />

                    <input type="file" name="resume" multiple className="w-full" />

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}
