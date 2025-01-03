import React, { useRef, useEffect, useState } from 'react';

function EditModal({ title, content, onClose, onSave, dataSave }) { 
  let lastTitleIndex = title.split(' > ').length-1;
  let lastTitle = title.split(' > ')[lastTitleIndex];
  const editorRef = useRef(null); // Ref to store the contentEditable div
  const [editableTitle, setEditableTitle] = useState(lastTitle); // State to store the editable title

  // This useEffect sets the initial content when the modal is opened.
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || ''; // Set the initial content, if any
    }
  }, [content]);

  const handleSave = () => {
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML.trim(); // Get the content directly from contentEditable div
      const finalContent = updatedContent ? updatedContent : []; // If content is empty, set it to an empty array
      onSave(finalContent, title, editableTitle); // Pass the updated content and title to onSave
      dataSave(true);
      onClose();
    }
  };

  const handleTitleChange = (e) => {
    setEditableTitle(e.target.value); // Update the title as the user types
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-[800px] h-auto py-4 rounded-md shadow-md overflow-auto">
        {/* Title input field to edit the title */}
        <div className="mb-4">
          <input
            type="text"
            value={editableTitle}  // Bind the input to the editableTitle state
            onChange={handleTitleChange}  // Update title as the user types
            className="w-full p-2 border rounded-md"
            placeholder="Enter title..."
          />
        </div>

        {/* Content editable div for editing the content */}
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
