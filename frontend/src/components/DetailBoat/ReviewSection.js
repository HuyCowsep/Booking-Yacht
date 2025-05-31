import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Divider, Stack, CircularProgress, Chip, Link } from "@mui/material";
import { Image } from "react-bootstrap";
import { setReviewSearchTerm, setReviewCurrentPage } from "../../redux/action";
import { fetchReviews } from "../../redux/asyncActions";
import ReviewHeader from "./Reviews/ReviewHeader";
import ReviewList from "./Reviews/ReviewList";
import ReviewForm from "./Reviews/ReviewForm";
import ReviewPagination from "./Reviews/ReviewPagination";
import RatingOverview from "./Reviews/RatingOverview";

export default function ReviewSection({ yachtId }) {
  const dispatch = useDispatch();
  const { reviews, ratingData, currentPage, totalPages, searchTerm, loading, error } = useSelector(
    (state) => state.reviews
  );
  const formRef = useRef(null); // Ref cho ReviewForm
  const loginMessageRef = useRef(null); // Ref cho thông báo đăng nhập
  const { isAuthenticated, customer } = useSelector((state) => state.auth);

  // Hàm cuộn đến ReviewForm hoặc thông báo đăng nhập
  const scrollToForm = () => {
    const targetRef = isAuthenticated ? formRef : loginMessageRef;
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // Điều chỉnh offset để bù cho sticky header (Tabs có top: 100px)
      setTimeout(() => {
        window.scrollBy({ top: -120, behavior: "smooth" }); // Bù 120px cho header
      }, 0);
    }
  };

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
    <Box sx={{ my: 6, pt: 6 }}>
      <ReviewHeader
        totalReviews={ratingData.total || 0}
        onSearch={handleSearch}
        isAuthenticated={isAuthenticated}
        scrollToForm={scrollToForm}
      />
      <Box sx={{ pt: 5 }}>
        <Image src="/images/border.jpg" />
      </Box>
      <Box sx={{ mb: 6, pt: 4 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Đang tải đánh giá...
            </Typography>
          </Box>
        )}
        {error && (
          <Typography variant="body1" color="error.main" align="center" sx={{ py: 4 }}>
            {error}
          </Typography>
        )}
        <RatingOverview ratingData={ratingData} />
        <ReviewList reviews={reviews} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
            <Typography variant="body2">Đang xem:</Typography>
            <Chip
              label={reviews.length}
              sx={{
                fontWeight: "medium",
                bgcolor: "background.paper",
                border: 2,
                borderColor: "divider",
                borderRadius: "16px",
              }}
            />
            <Typography variant="body2">kết quả trong tổng</Typography>
            <Typography variant="body1" fontWeight="medium">
              {ratingData.total}
            </Typography>
            <Typography variant="body2">đánh giá</Typography>
          </Box>
          <ReviewPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setReviewCurrentPage(page))}
          />
        </Box>
        <Divider sx={{ my: 4, borderColor: "divider" }} />
        {/* Phần chứa ReviewForm hoặc thông báo đăng nhập */}
        {isAuthenticated ? (
          <div ref={formRef}>
            <ReviewForm
              yachtId={yachtId}
              customer={customer}
              onSubmitSuccess={() => dispatch(fetchReviews(yachtId, 1, searchTerm))}
            />
          </div>
        ) : (
          <div ref={loginMessageRef}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Vui lòng{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textDecoration: "underline",
                    "&:hover": {
                      color: "red",
                      textDecoration: "underline",
                    },
                  }}
                >
                  đăng nhập
                </Link>{" "}
                để gửi đánh giá.
              </Typography>
            </Box>
          </div>
        )}
      </Box>
    </Box>
  );
}