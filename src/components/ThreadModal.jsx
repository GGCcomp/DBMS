import { useState } from "react";
import { motion } from "framer-motion";

const ThreadModal = ({ thread, onClose }) => {
    const [open, setOpen] = useState(false);

    return (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">{thread.title}</h2>
                        <p className="text-gray-600 mt-2">{thread.content}</p>
                        <div className="mt-4 text-sm text-gray-500">
                            <p><strong>Author:</strong> {thread.author || "Unknown"}</p>
                            <p><strong>Category:</strong> {thread.category}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
    );
};

export default ThreadModal;
