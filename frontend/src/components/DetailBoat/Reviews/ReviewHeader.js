// components/ReviewHeader.jsx
import { Star } from "lucide-react";

const ReviewHeader = ({ totalReviews }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="font-bold  text-gray-900 text-4xl ">
        Đánh giá ({totalReviews})
      </p>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm đánh giá"
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-full text-sm w-56"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm flex items-center">
          <Star fill="white" size={16} className="mr-1" /> Gửi đánh giá
        </button>
      </div>
    </div>
  );
};

export default ReviewHeader;