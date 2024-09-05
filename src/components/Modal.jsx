"use client";
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Modal({ onClose, id, selectedSection, api, onSectionAdded }) {
  const [title, setTitle] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content: [], id, selectedTitle: selectedSection }),
      });

      const data = await response.json(); // Ensure the response is converted to JSON

      if (data.success) {
        toast.success(data.message);
        onSectionAdded();
        onClose();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while adding the section.");
    }
  };

  const sections = selectedSection.split('>');
  const trimmedSections = sections.map(section => section.trim());
  const lastSection = trimmedSections[trimmedSections.length - 1];

  return (
    <div className="absolute left-10 w-96 z-50 h-56 flex justify-between bg-white rounded-md shadow-md">
      <div className="order-2">
        <button onClick={onClose} className="bg-red-400 p-2 rounded-tr-md">X</button>
      </div>
      <form onSubmit={submitHandler} className="flex flex-col justify-center gap-3 h-full pl-10">
        <p>{lastSection}:</p>
        <label htmlFor="section">New Section:</label>
        <input
          type="text"
          name="section"
          id="section"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border"
        />
        <button type="submit" className="px-3 py-1 bg-blue-300">Add Section</button>
      </form>
    </div>
  );
}

export default Modal;
