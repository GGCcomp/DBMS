import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function Modal({ items, onClose, loadInterviews }) {
    const [form, setForm] = useState({
        candidateName: items.candidateName || "",
        email: items.email || "",
        phoneNo: items.phoneNo || "",
        position: items.position || "",
        interviewDate: items.interviewDate?.slice(0, 10) || "",
        interviewer: items.interviewer.join(", ") || "",
        interviewerEmail: items.interviewerEmail.join(", ") || "",
        meetingLink: items.meetingLink || ""
    });
    const fileInputRef = useRef(null);
    const [resume, setResume] = useState(items.resumePreviewUrl || null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const fd = new FormData();
            for (let key in form) {
                if (key === "interviewer") {
                    const arr = form[key].split(",").map((i) => i.trim());
                    arr.forEach((name) => fd.append("interviewer", name));
                } else {
                    fd.append(key, form[key]);
                }
            }
            if (resume) fd.append("resume", resume);
            fd.append("id", items._id);

            const res = await fetch("/api/hr/interview", {
                method: "PUT",
                body: fd,
            });

            const data = await res.json();
            setMsg(data.message);
            setResume(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            loadInterviews(1);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeDelete = async () => {
        try {
            const res = await fetch("/api/hr/interview/resume", {
                method: "DELETE",
                body: JSON.stringify({ id: items._id }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                alert("Resume deleted successfully");
                loadInterviews(1);
                onClose();
            } else {
                alert(data.error || "Failed to delete resume");
            }
        } catch (err) {
            console.error("Resume deletion failed:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    Edit Candidate's Detail
                </h2>

                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Candidate Name</label>
                            <input
                                type="text"
                                value={form.candidateName}
                                onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Phone Number</label>
                            <input
                                type="tel"
                                value={form.phoneNo}
                                onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Position</label>
                            <input
                                type="text"
                                value={form.position}
                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Interview Date</label>
                            <input
                                type="date"
                                value={form.interviewDate}
                                onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Interviewers (comma separated)</label>
                            <input
                                type="text"
                                value={form.interviewer}
                                onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Interviewers Emails (comma separated)</label>
                            <input
                                type="text"
                                value={form.interviewerEmail}
                                onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Meeting Link</label>
                            <input
                                type="url"
                                value={form.meetingLink}
                                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Resume Link</label>
                            <input
                                type="text"
                                value={resume}
                                readOnly
                                className="input w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Upload Resume
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => setResume(e.target.files[0])}
                                className="file-input"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update"}
                            </button>

                            {items.resumePreviewUrl && (
                                <button
                                    type="button"
                                    onClick={handleResumeDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete Resume
                                </button>
                            )}
                        </div>
                        </div>

                        {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}
                </form>
            </motion.div>
        </div>
    );
}

export default Modal;
