"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Modal = ({ title, defaultTitle = "", defaultFiles = [], defaultCategory = "", onClose, onSave }) => {
  const [inputTitle, setInputTitle] = useState(defaultTitle);
  const [selectedFiles, setSelectedFiles] = useState(defaultFiles);
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>

        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          className="w-full p-2 border rounded-md mb-3"
          placeholder="Enter document title"
          required
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md mb-3"
          required
        >
          <option value="">Select a category</option>
          <option value="social_media">Social Media</option>
          <option value="advertisement">Advertisement</option>
        </select>

        {selectedCategory === "changes" && <textarea onChange={(e) => setText(e.target.value)} className="p-2 w-full border rounded-md" placeholder="Enter Content..."></textarea>}

        {selectedCategory !== "changes" && (
          <>
            <input
              type="file"
              multiple
              accept=".pdf, .doc, .docx, .xls, .xlsx, image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md mb-3"
              required
            />

            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
              placeholder="Enter Github Repo link"
            />
          </>
        )}


        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
            onClick={() => onSave(inputTitle, selectedCategory, selectedFiles, text)}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Page = () => {
  const [documents, setDocuments] = useState({
    social_media: [],
    advertisement: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState({ open: false, title: "", files: [], category: "" });

  const handleOpenModal = () => setModalData({ open: true, title: "", files: [], category: "" });

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/development/overview");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch documents");
      }

      setDocuments(data.documents);
    } catch (err) {
      console.error("Error fetching documents:", err.message);
      setError("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSaveDocument = async (title, category, files, text) => {
    const formData = new FormData();
    formData.append("name", title);
    formData.append("category", category);
    formData.append("text", text)
    Array.from(files).forEach(file => formData.append("file", file));

    const res = await fetch("/api/marketing/report-submission", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      fetchDocuments();
      try {
        await fetch("/api/audit-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Upload",
            details: "In Report Submission"
          }),
        });
      } catch (error) {
        console.error("Failed to log audit:", error);
      }
      setModalData({ open: false, title: "", files: [], category: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-white mb-6"
      >
        Report Submission
      </motion.h1>

      {loading && <p className="text-white text-lg">Loading reports...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      <div className="w-full max-w-4xl space-y-4">
        {Object.keys(documents).map((category) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold capitalize">{category}</h3>
            {documents[category].length > 0 ? (
              documents[category].map((doc, index) => (
                <div key={index} className="border-b py-2">
                  <span className="font-semibold text-xl uppercase">{index + 1}. {doc.fileName}</span>
                  {doc.text && <p className="p-2">{doc.text}</p>}
                  <div className="flex space-x-3 py-1">
                    {doc.previewUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 border border-blue-500 rounded-md"
                      >
                        View
                      </a>
                    ))}
                    {doc.downloadUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        download
                        className="text-green-500 hover:bg-green-500 hover:text-white px-3 py-1 border border-green-500 rounded-md"
                        onClick={async (e) => {
                          try {
                            await new Promise((resolve) => setTimeout(resolve, 1000));

                            await fetch("/api/audit-log", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                action: "Download",
                                details: "From Report",
                              }),
                            });
                          } catch (error) {
                            console.error("Failed to log audit:", error);
                          }
                        }}
                      >
                        Download
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No report available.</p>
            )}
          </div>
        ))}

        <button
          className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          onClick={handleOpenModal}
        >
          + Add Report
        </button>
      </div>

      {modalData.open && (
        <Modal
          title="Add Document"
          defaultTitle={modalData.title}
          defaultFiles={modalData.files}
          defaultCategory={modalData.category}
          onClose={() => setModalData({ open: false, title: "", files: [], category: ""})}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
};

export default Page;
