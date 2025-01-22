import React from 'react';

function AnnouncementModal({ onClose, data }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-8 shadow-lg transition-all transform scale-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-center text-gray-800">
            Announcement from <strong>{data.name}</strong>
          </h1>
        </div>

        <div className="space-y-4">
          <span className="block text-sm text-gray-600">On: {data.date}</span>
          <p className="text-lg text-gray-700">{data.text}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementModal;
