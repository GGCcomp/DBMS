"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";

export default function Page() {
  const [form, setForm] = useState({
    candidateName: "",
    email: "",
    phoneNo: "",
    position: "",
    interviewDate: "",
    interviewer: "",
    interviewerEmail: "",
    meetingLink: "",
  });
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState({});
  const [resume, setResume] = useState(null);
  const [msg, setMsg] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [viewResumeUrl, setViewResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const interviewers = {
    Alok: "alok@niveshjano.in",
    Abhishek: "abhishek@niveshjano.in",
    Ashutosh: "ashutosh@niveshjano.in",
    HR: "hr@niveshjano.in",
    Marketing: "marketing@niveshjano.in"
  };


  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageClick = (pageNum) => {
    loadInterviews(pageNum);
  };

  useEffect(() => {
    loadInterviews(1);
  }, []);

  const loadInterviews = async (pageToLoad) => {
    const res = await fetch(`/api/hr/interview?page=${pageToLoad}`);
    const data = await res.json();
    setInterviews(data.interviews);
    setTotal(data.total);
    setCurrentPage(pageToLoad);
  };


  const handleEditModal = (data) => {
    setIsEditing(!isEditing);
    setModalData(data)
  }

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    if (name === "interviewer") {
      const selectedNames = Array.from(selectedOptions, (opt) => opt.value);
      const selectedEmails = selectedNames
        .map((name) => interviewers[name])
        .filter(Boolean)
        .join(", ");

      setForm({
        ...form,
        interviewer: selectedNames.join(", "),
        interviewerEmail: selectedEmails,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
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

      const res = await fetch("/api/hr/interview", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setMsg(data.message);
      setForm({
        candidateName: "",
        email: "",
        phoneNo: "",
        position: "",
        interviewDate: "",
        interviewer: "",
        interviewerEmail: "",
        meetingLink: "",
      });
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadInterviews(1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, email, interviewerEmail, candidateName, position, interviewDate, meetingLink, interviewer) => {
    const res = await fetch(`/api/hr/interview`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: newStatus,
        email,
        interviewerEmail,
        candidateName,
        position,
        interviewDate,
        meetingLink,
        interviewer,
      }),
    });

    const data = await res.json();
    setMsg(data.message);
    loadInterviews(1);
  };


  const deleteOne = async (id) => {
    await fetch(`/api/hr/interview`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadInterviews(1);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white shadow p-6 rounded-xl"
        >
          <h2 className="col-span-full text-xl font-bold">Schedule Interview</h2>

          {/* Text Inputs */}
          {["candidateName", "email", "phoneNo", "position", "interviewDate", "meetingLink"].map((key) => (
            <div key={key}>
              <label className="block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={key === "interviewDate" ? "date" : "text"}
                name={key}
                placeholder={key}
                value={form[key]}
                onChange={handleChange}
                required
                className="p-2 border rounded w-full"
              />
            </div>
          ))}

          {/* Interviewer Select */}
          <div>
            <label className="block mb-1">Interviewers</label>
            <select
              name="interviewer"
              multiple
              value={form.interviewer.split(", ").filter(Boolean)}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full h-32"
            >
              {Object.keys(interviewers).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>


          {/* Interviewer Email (read-only for submission/debug) */}
          <div>
            <label className="block mb-1">Interviewer Emails</label>
            <input
              type="text"
              value={form.interviewerEmail}
              readOnly
              className="p-2 border rounded w-full bg-gray-100"
            />
          </div>


          {/* Resume Upload */}
          <div className="col-span-full">
            <label className="block mb-1">Resume</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setResume(e.target.files[0])}
              required
              className="file-input"
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {!loading ? "Submit" : "Saving..."}
          </button>

          {msg && <p className="text-green-700 col-span-full">{msg}</p>}
        </form>


        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            View Scheduled Interviews
          </button>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            >
              {isEditing && <Modal items={modalData} onClose={() => setIsEditing(false)} loadInterviews={loadInterviews} />}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white max-w-2xl w-full p-6 rounded-xl shadow-lg overflow-auto max-h-[80vh]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Interview List</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Close
                  </button>
                </div>
                <ul className="space-y-4">
                  {interviews.map((item) => (
                    <li
                      key={item._id}
                      className="p-4 border rounded-md bg-gray-50 shadow"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p><strong>Name:</strong> {item.candidateName}</p>
                        <p><strong>Email:</strong> {item.email}</p>
                        <p><strong>Phone:</strong> {item.phoneNo}</p>
                        <p><strong>Position:</strong> {item.position}</p>
                        <p>
                          <strong>Interviewers:</strong>{" "}
                          {item.interviewer.map((name, idx) => (
                            <span key={idx} className="inline-block mr-1 px-2 py-0.5 bg-gray-200 rounded">
                              {name.trim()}
                            </span>
                          ))}
                        </p>
                        <a href={item.meetingLink} className="text-blue-600 underline">
                          Meeting Link
                        </a>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(item.interviewDate).toLocaleDateString()}
                        </p>
                        <p><strong>Status:</strong> {item.status}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <select
                          defaultValue={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item._id,
                              e.target.value,
                              item.email,
                              item.interviewerEmail[0]?.split(',').map(e => e.trim()),
                              item.candidateName,
                              item.position,
                              item.interviewDate,
                              item.meetingLink,
                              item.interviewer
                            )
                          }
                          className="border p-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button onClick={() => handleEditModal(item)} className="bg-yellow-400 text-white px-3 py-1 rounded">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOne(item._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                        <a
                          href={item.resumeDownloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Download Resume
                        </a>
                        <button
                          onClick={() => setViewResumeUrl(item.resumePreviewUrl)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                          View Resume
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageClick(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {viewResumeUrl && (
          <div className="mt-6 border rounded overflow-hidden relative">
            <iframe
              src={viewResumeUrl}
              title="Resume Preview"
              width="100%"
              height="600px"
              className="border"
            ></iframe>
            <button
              onClick={() => setViewResumeUrl("")}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}