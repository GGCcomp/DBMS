"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const Modal = ({ title, defaultTitle = "", defaultFiles = [], defaultCategory = "", defaultLink = "", onClose, onSave, loading }) => {
  const [inputTitle, setInputTitle] = useState(defaultTitle);
  const [selectedFiles, setSelectedFiles] = useState(defaultFiles);
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedLink, setSelectedLink] = useState(defaultLink);


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

        <input
          type="text"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md mb-3"
          placeholder="Enter category"
          required
        />

        <input
          type="text"
          value={selectedLink}
          onChange={(e) => setSelectedLink(e.target.value)}
          className="w-full p-2 border rounded-md mb-3"
          placeholder="Enter Link"
          required
        />

        <textarea
          onChange={(e) => setText(e.target.value)}
          className="p-2 w-full border rounded-md mb-3"
          placeholder="Enter content (optional if uploading file)"
        ></textarea>

        <input
          type="file"
          multiple
          accept=".pdf, .doc, .docx, .xls, .xlsx, image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-md mb-3"
        />

        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
            onClick={() => onSave(inputTitle, selectedCategory, selectedFiles, text, selectedLink)}
          >
            {!loading ? " Save" : "Saving.."}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Page = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalData, setModalData] = useState({ open: false, title: "", files: [], category: "", link: "" });


  const handleOpenModal = () => setModalData({ open: true, title: "", files: [], category: "", link: "" });

  const fetchDocuments = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/development/overview?page=${pageNumber}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch documents");

      setDocuments(data.documents);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching documents:", err.message);
      setError("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  console.log(documents[3]);

  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  const handleSaveDocument = async (title, category, files, text, link) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("name", title);
    formData.append("category", category);
    formData.append("text", text);
    formData.append("link", link);
    formData.append("user", session?.user?.name || "unknown");
    Array.from(files).forEach(file => formData.append("file", file));

    const res = await fetch("/api/development/overview", {
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
      setModalData({ open: false, title: "", files: [], category: "", link: "" });
      setUploading(false);
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
        Project Submission
      </motion.h1>

      {loading && <p className="text-white text-lg">Loading reports...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg overflow-x-scroll">
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Uploaded By</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Document</th>
              <th className="p-2 border">Actions</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border capitalize">{doc.user || "Unknown"}</td>
                  <td className="p-2 border capitalize">{doc.category}</td>
                  <td className="p-2 border">
                    {doc.text ? (
                      <span>{doc.text.slice(0, 50)}...</span>
                    ) : (
                      <span>{doc.fileName}</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      {doc.previewUrls?.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      ))}
                      {doc.downloadUrls?.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          download
                          className="text-green-500 hover:underline"
                          onClick={async () => {
                            try {
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
                  </td>
                  <td className="p-2 border"><a href={doc.link} target="_blank" rel="noopener noreferrer">Github</a></td>
                  <td className="p-2 border">{new Date(doc.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <button
          className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
          onClick={handleOpenModal}
        >
          + Add Document
        </button>
      </div>

      {modalData.open && (
        <Modal
          title="Add Document"
          defaultTitle={modalData.title}
          defaultFiles={modalData.files}
          defaultCategory={modalData.category}
          defaultLink={modalData.link}
          onClose={() => setModalData({ open: false, title: "", files: [], category: "", link: "" })}
          onSave={handleSaveDocument}
          loading={uploading}
        />
      )}
    </div>
  );
};

export default Page;
