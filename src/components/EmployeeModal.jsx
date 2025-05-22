"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function EmployeesModal({ onClose, reload }) {
    const [promotionFields, setPromotionFields] = useState([""]);
    const [benefitFields, setBenefitFields] = useState([""]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData(e.currentTarget);

            const res = await fetch('/api/hr/employee', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                reload();
                onClose();
            } else {
                alert(data.error || 'Something went wrong');
            }
        } catch (err) {
            console.log(err); 
        } finally {
            setLoading(false);
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
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-scroll max-h-[70vh]"
                    encType="multipart/form-data"
                >
                    {/* Personal Info */}
                    <input name="name" required placeholder="Full Name" className="p-2 border rounded-xl" />
                    <input name="contact" required placeholder="Contact Number" className="p-2 border rounded-xl" />
                    <input name="emergency" required placeholder="Emergency Contact" className="p-2 border rounded-xl" />

                    {/* Bank Details */}
                    <input name="bank[name]" required placeholder="Bank Name" className="p-2 border rounded-xl" />
                    <input name="bank[accountNo]" required placeholder="Account Number" className="p-2 border rounded-xl" />
                    <input name="bank[IFSC]" required placeholder="IFSC Code" className="p-2 border rounded-xl" />
                    <input name="bank[branch]" required placeholder="Branch Name" className="p-2 border rounded-xl" />

                    {/* Employment Details */}
                    <input name="title" required placeholder="Job Title" className="p-2 border rounded-xl" />
                    <input name="department" required placeholder="Department" className="p-2 border rounded-xl" />
                    <input name="workModel" required placeholder="Work Model (e.g. Remote)" className="p-2 border rounded-xl" />

                    {/* Promotions */}
                    {/* {promotionFields.map((_, index) => (
                        <input
                            key={index}
                            name="promotions"
                            placeholder={`Promotion ${index + 1}`}
                            className="p-2 border rounded-xl col-span-1 md:col-span-2"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => setPromotionFields([...promotionFields, ""])}
                        className="text-sm text-blue-600 hover:underline col-span-1 md:col-span-2"
                    >
                        + Add Promotion
                    </button> */}

                    {/* Benefits */}
                    {/* {benefitFields.map((_, index) => (
                        <input
                            key={index}
                            name="benefits"
                            placeholder={`Benefit ${index + 1}`}
                            className="p-2 border rounded-xl col-span-1 md:col-span-2"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => setBenefitFields([...benefitFields, ""])}
                        className="text-sm text-blue-600 hover:underline col-span-1 md:col-span-2"
                    >
                        + Add Benefit
                    </button> */}

                    {/* File Upload */}
                    <div className="col-span-1 md:col-span-2">
                        <input type="file" name="resume" multiple className="w-full" />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 col-span-1 md:col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                        disabled={loading}
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {!loading ? "Save" : "Saving.."}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
