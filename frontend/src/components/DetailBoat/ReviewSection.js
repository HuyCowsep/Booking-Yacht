import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import ReviewHeader from "./Reviews/ReviewHeader";
import ReviewList from "./Reviews/ReviewList";
import ReviewForm from "./Reviews/ReviewForm";
import ReviewPagination from "./Reviews/ReviewPagination";
import RatingOverview from "./Reviews/RatingOverview";
import { Image } from "react-bootstrap";
import { setReviewSearchTerm, setReviewCurrentPage } from "../../redux/action";
import { fetchReviews } from "../../redux/asyncActions";

export default function ReviewSection({ yachtId }) {
  const dispatch = useDispatch();
  const {
    reviews,
    ratingData,
    currentPage,
    totalPages,
    searchTerm,
    loading,
    error,
  } = useSelector((state) => state.reviews);
  const { isAuthenticated, customer } = useSelector((state) => state.auth);

  useEffect(() => {
    if (yachtId) {
      dispatch(fetchReviews(yachtId, currentPage, searchTerm));
    }
  }, [dispatch, yachtId, currentPage, searchTerm]);

  const handleSearch = (term) => {
    dispatch(setReviewSearchTerm(term));
    dispatch(setReviewCurrentPage(1)); // Reset to page 1 on new search
  };

  return (
    <div className="my-6 pt-6">
      <ReviewHeader
        totalReviews={ratingData.total}
        onSearch={handleSearch}
        isAuthenticated={isAuthenticated}
      />
      <Image src="../icons/heading-border.webp" className="pt-5" />
      <div className="border-gray-300 mb-6 pt-4">
        {loading && <div>Đang tải đánh giá...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <RatingOverview ratingData={ratingData} />
        <ReviewList reviews={reviews} />
        <div className="flex items-center justify-between">
          <Box
            className="text-sm"
            sx={{ color: (theme) => theme.palette.text.secondary }}
          >
            Đang xem:{" "}
            <span className="font-medium rounded-full border-2 border-gray-300 px-3 py-2">
              {reviews.length}
            </span>{" "}
            của <span className="font-medium">{ratingData.total}</span>
          </Box>
          <ReviewPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setReviewCurrentPage(page))}
          />
        </div>
        <hr className="p-2" />
        {isAuthenticated ? (
          <ReviewForm
            yachtId={yachtId}
            customer={customer}
            onSubmitSuccess={() =>
              dispatch(fetchReviews(yachtId, 1, searchTerm))
            }
          />
        ) : (
          <div className="text-center text-gray-600 py-4">
            Vui lòng{" "}
            <Link to="/login" className="text-teal-500 underline">
              đăng nhập
            </Link>{" "}
            để gửi đánh giá.
          </div>
        )}
      </div>
    </div>
  );
}
