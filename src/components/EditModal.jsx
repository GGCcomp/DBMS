import React, { useRef, useEffect } from 'react';

function EditModal({ title, content, onClose, onSave, dataSave }) {
  const editorRef = useRef(null); // Ref to store the contentEditable div

  // This useEffect sets the initial content when the modal is opened.
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content; // Set the initial content
    }
  }, [content]);

  const handleSave = () => {
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML; // Get the content directly from contentEditable div
      onSave(updatedContent, title); // Pass the updated content and title to onSave
      dataSave(true);
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-[800px] h-auto py-4 rounded-md shadow-md overflow-auto">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {/* Use div with contentEditable for rich-text editing */}
        <div
          ref={editorRef} // Attach the ref to access content directly
          contentEditable
          className="w-full h-96 p-4 border rounded-md"
          placeholder="Start editing..."
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
