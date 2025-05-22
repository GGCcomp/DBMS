import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployeeDocuments({ documents }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="mt-4">
      {documents && documents.length > 0 ? (
        <>
          <div className="space-y-3 mb-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveIndex(index)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-sm"
                >
                  📄 View Document {index + 1}
                </button>
                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  ⬇️ Download Document {index + 1}
                </a>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <iframe
                  src={documents[activeIndex].previewUrl}
                  className="w-full h-64 border-2 border-gray-200 rounded-lg"
                  title={`Document Preview ${activeIndex + 1}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <p className="text-sm text-gray-400 italic">No documents available.</p>
      )}
    </div>
  );
}
