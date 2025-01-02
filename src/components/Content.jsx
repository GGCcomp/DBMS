import React, { useState } from 'react';
import EditModal from './EditModal'; // Import your modal component

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

  return (
    <div className='bg-white shadow-md mt-10 py-10'>
      <div className='text-xl font-semibold text-center'>
        {title === 'Please select a section' ? <p>No Section Selected</p> : <p className='uppercase'>{title}</p>}
      </div>
      <div className='pt-5'>
        {content && content.length > 0 ? 
          content.map((item, i) => (
            <div key={i} className='px-8 text-left'>
              <div dangerouslySetInnerHTML={{ __html: item }} />
              <button 
                onClick={() => handleEditClick(item)} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
            </div>
          )) 
          : <p className='text-lg px-8'>No data, Check the nestings!</p>}
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
