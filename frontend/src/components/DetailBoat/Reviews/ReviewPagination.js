// components/ReviewPagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReviewPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center mt-6 mb-8">
      <button
        className="px-3 py-2 border border-gray-300 rounded-l-full  text-gray-600 flex items-center"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} /> Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`w-[40px] h-[42px] flex  items-center justify-center rounded-md ${
            page === currentPage
              ? "bg-gray-400 text-black"
              : "border border-gray-300 text-gray-600"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-2 border border-gray-300 rounded-r-full  text-gray-600 flex items-center"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Tiếp <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default ReviewPagination;