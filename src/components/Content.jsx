import React, { useState } from 'react';
import EditModal from './EditModal'; // Import your modal component
import html2pdf from 'html2pdf.js';

function Content({ title, content, onUpdate, dataSave }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleEditClick = (content) => {
    setEditContent(content); // Set the content to be edited
    setModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const handleDownload = (index) => {
    const element = document.getElementById(`content-item-${index}`);
    if (!element) return;

    // Hide the buttons during PDF generation to avoid them in the PDF
    const buttons = element.querySelectorAll('button');
    buttons.forEach((btn) => (btn.style.display = 'none'));

    // Use html2pdf to convert the content to PDF
    const options = {
      margin: 10,
      filename: `${title || 'content'}-${index + 1}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    };

    // Generate the PDF
    html2pdf().from(element).set(options).save();

    // Restore buttons after saving the PDF
    buttons.forEach((btn) => (btn.style.display = ''));
  };

  return (
    <div className="bg-white shadow-md mt-10 py-10">
      <div className="text-xl font-semibold text-center">
        {title === 'Please select a section' ? (
          <p>No Section Selected</p>
        ) : (
          <p className="uppercase">{title}</p>
        )}
      </div>
      <div className="pt-5">
        {content && content.length > 0 ? (
          content.map((item, i) => (
            <> <div
              key={i}
              className="px-8 text-left bg-gray-50 p-4 rounded-md shadow-sm"
              id={`content-item-${i}`}
            >
              {/* Render the content */}
              <div dangerouslySetInnerHTML={{ __html: item }} />
              
            </div>
            <div className="flex justify-center gap-2 mt-3">
            {/* Edit Button */}
            <button
              onClick={() => handleEditClick(item)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            {/* Download Button */}
            <button
              onClick={() => handleDownload(i)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download
            </button>
          </div></>
          ))
        ) : (
          <p className="text-lg px-8">No data, Check the nestings!</p>
        )}
      </div>

      {modalOpen && (
        <EditModal
          title={title}
          content={editContent}
          onClose={handleCloseModal}
          onSave={onUpdate}
          dataSave={dataSave}
        />
      )}
    </div>
  );
}

export default Content;
