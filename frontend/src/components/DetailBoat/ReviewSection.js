// App.jsx
import { useState } from "react";
import ReviewHeader from "./Reviews/ReviewHeader";
import { ratingData, reviewsData } from "../../data/reviewData";
import RatingOverview from "./Reviews/RatingOverview";
import ReviewList from "./Reviews/ReviewList";
import ReviewPagination from "./Reviews/ReviewPagination";
import ReviewForm from "./Reviews/ReviewForm";
import { Image } from "react-bootstrap";

export default function ReviewSection() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="my-6 pt-6">
      {/* Header */}
      <ReviewHeader totalReviews={ratingData.total} />
      <Image src={"./images/heading-border.webp"} className="pt-5 " />
      <div className=" border-gray-300 mb-6 pt-4">
        {/* Rating overview */}
        <RatingOverview ratingData={ratingData} />

        {/* Reviews list */}
        <ReviewList reviews={reviewsData} />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Đang xem:{" "}
            <span className="font-medium rounded-full border-2 border-gray-300 px-3 py-2">
              5
            </span>{" "}
            của <span className="font-medium">{ratingData.total}</span>
          </div>
          <ReviewPagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </div>
        <hr className="p-2 " />

        {/* Review form */}
        <ReviewForm />
      </div>
    </div>
  );
}