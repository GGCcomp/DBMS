"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Banknote, Fingerprint, Eye, DownloadCloud } from "lucide-react";

const Modal = ({ title, defaultTitle = "", defaultFiles = [], defaultCategory = "", onClose, onSave, loading }) => {
  const [inputTitle, setInputTitle] = useState(defaultTitle);
  const [selectedFiles, setSelectedFiles] = useState(defaultFiles);
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
          <option value="Smart Contracts & Decentralized Finance">Smart Contracts & Decentralized Finance</option>
          <option value="Central Bank Digital Currency">Central Bank Digital Currency</option>
          <option value="AI Fairness & Compliance">AI Fairness & Compliance</option>
        </select>

        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-md"
          required
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
            onClick={() => onSave(inputTitle, selectedCategory, selectedFiles)}
          >
            {loading ? "Saving" : "Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Page = () => {
  const [documents, setDocuments] = useState({
    "Smart Contracts & Decentralized Finance": [],
    "Central Bank Digital Currency": [],
    "Digital Identity & KYC Innovations": []
  });

  const categoryIcons = {
    "Smart Contracts & Decentralized Finance": <Wallet className="h-8 w-8 text-blue-600" />,
    "Central Bank Digital Currency": <Banknote className="h-8 w-8 text-green-500" />,
    "Digital Identity & KYC Innovations": <Fingerprint className="h-8 w-8 text-purple-500" />
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState({ open: false, title: "", files: [], category: "" });

  const handleOpenModal = () => setModalData({ open: true, title: "", files: [], category: "" });

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/research/blockchain");
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

  const handleSaveDocument = async (title, category, files) => {
    const formData = new FormData();
    formData.append("name", title);
    formData.append("category", category);
    Array.from(files).forEach(file => formData.append("file", file));

    setLoading(true);

    const res = await fetch("/api/research/blockchain", {
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
            details: "In Blockchain [Research]"
          }),
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to log audit:", error);
        setLoading(false);
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
        Blockchain & Digital Finance
      </motion.h1>

      {loading && <p className="text-white text-lg">Loading documents...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}


      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(documents).map((category) => (
          <div
            key={category}
            className={`${documents[category].length > 0 ? "h-auto" : "h-36"} bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500`}
          >
            {/* Category Header with Icon */}
            <div className="flex items-center space-x-3 mb-4">
              {categoryIcons[category]}
              <h3 className="text-2xl font-bold capitalize text-blue-600">
                {category}
              </h3>
            </div>

            {/* Document List */}
            {documents[category].length > 0 ? (
              documents[category].map((doc, index) => (
                <div
                  key={index}
                  className="border-b py-3 flex flex-col space-y-2 last:border-none"
                >
                  <span className="font-medium text-lg text-gray-700">
                    {index + 1}. {doc.fileName}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {doc.previewUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1.5 border border-blue-500 rounded-md transition"
                      >
                        <Eye className="h-4 w-4" /> View
                      </a>
                    ))}

                    {doc.downloadUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        download
                        className="flex items-center gap-1 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1.5 border border-green-500 rounded-md transition"
                        onClick={async (e) => {
                          try {
                            await new Promise((resolve) => setTimeout(resolve, 1000));

                            await fetch("/api/audit-log", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                action: "Download",
                                details: "From Blockchain [Research]",
                              }),
                            });
                          } catch (error) {
                            console.error("Failed to log audit:", error);
                          }
                        }}
                      >
                        <DownloadCloud className="h-4 w-4" /> Download
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">No documents available.</p>
            )}
          </div>
        ))}


      </div>
      <div className="w-full flex justify-center">
        <button
          className="mt-4 w-full max-w-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 transform transition"
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
          onClose={() => setModalData({ open: false, title: "", files: [], category: "" })}
          onSave={handleSaveDocument}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Page;
