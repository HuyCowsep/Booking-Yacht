// components/ReviewPagination.jsx
import { Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReviewPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Box
      className="flex items-center justify-center mt-6 mb-8"
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        borderColor: (theme) => theme.palette.divider,
        boxShadow: (theme) => theme.shadows[1],
        color: (theme) => theme.palette.text.primary,
        borderRadius: "32px",
      }}
    >
      <button
        className="px-3 py-2 border  rounded-l-full   flex items-center"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} /> Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`w-[40px] h-[42px] flex  items-center justify-center rounded ${
            page === currentPage ? "bg-gray-400 " : "border border-gray-300 "
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-2 border  rounded-r-full   flex items-center"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Tiếp <ChevronRight size={16} />
      </button>
    </Box>
  );
};

export default ReviewPagination;
