export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrevious = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };
  
    return (
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  }
  