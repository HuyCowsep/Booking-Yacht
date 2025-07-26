import axios from "axios";
import {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  submitReviewRequest,
  submitReviewSuccess,
  submitReviewFailure,
} from "../actions/reviewActions";

// Ví dụ:
// export const fetchReviews = (yachtId, page = 1, search = "") => async (dispatch) => {
//   // ... logic ...
// };
// ... (Các async action review khác sẽ được thêm tiếp vào file này)

export const fetchReviews =
  (yachtId, page = 1, search = "") =>
  async (dispatch) => {
    dispatch(fetchReviewsRequest());
    try {
      const response = await axios.get(
        "http://localhost:9999/api/v1/feedback",
        {
          params: { yachtId, page, limit: 5, search },
        }
      );
      const apiData = response.data.data || response.data;
      const reviews = apiData.reviews || [];
      const processedData = {
        reviews: reviews.map((review) => {
          let formattedDate = "N/A";
          const dateFields = ["createdAt", "created_at", "date", "reviewDate"];
          for (const field of dateFields) {
            if (review[field]) {
              try {
                let dateValue = review[field];
                if (typeof dateValue === "object" && dateValue.$date) {
                  dateValue = dateValue.$date;
                }
                if (typeof dateValue === "string") {
                  const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                  const ddmmyyyyMatch = dateValue.match(ddmmyyyyPattern);
                  if (ddmmyyyyMatch) {
                    formattedDate = dateValue;
                    break;
                  } else {
                    const date = new Date(dateValue);
                    if (!isNaN(date.getTime())) {
                      formattedDate = date.toLocaleDateString("vi-VN");
                      break;
                    }
                  }
                } else {
                  const date = new Date(dateValue);
                  if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString("vi-VN");
                    break;
                  }
                }
              } catch (error) {}
            }
          }
          let userName = "Khách ẩn danh";
          if (review.customerId?.fullName) {
            userName = review.customerId.fullName;
          } else if (review.customerName) {
            userName = review.customerName;
          } else if (review.customer?.fullName) {
            userName = review.customer.fullName;
          } else if (review.user?.name) {
            userName = review.user.name;
          } else if (review.userName) {
            userName = review.userName;
          } else if (review.name) {
            userName = review.name;
          }
          return {
            id:
              review.id ||
              review._id?.$oid ||
              review._id ||
              Math.random().toString(36),
            userName: userName,
            rating: review.starRating || review.rating || 0,
            comment: review.description || review.comment || review.text || "",
            date: formattedDate,
            tag:
              review.customerId?.tag ||
              review.customer?.tag ||
              review.tag ||
              null,
          };
        }),
        ratingData: apiData.ratingData || {
          total: 0,
          average: 0,
          distribution: [],
        },
        currentPage: apiData.currentPage || page,
        totalPages: apiData.totalPages || 1,
        total: apiData.total || reviews.length,
      };
      dispatch(fetchReviewsSuccess(processedData));
    } catch (error) {
      dispatch(fetchReviewsFailure(error.message));
    }
  };

export const submitReview = (reviewData) => async (dispatch) => {
  dispatch(submitReviewRequest());
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      const errorMsg = "Không tìm thấy token xác thực.";
      dispatch(submitReviewFailure(errorMsg));
      return { success: false, message: errorMsg };
    }
    const requestBody = {
      starRating: parseInt(reviewData.starRating),
      description: reviewData.description.trim(),
      yachtId: reviewData.yachtId,
      customerId: reviewData.customerId,
    };
    const response = await axios.post(
      "http://localhost:9999/api/v1/feedback",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data && response.data.success === true) {
      dispatch(submitReviewSuccess());
      if (reviewData.yachtId) {
        dispatch(fetchReviews(reviewData.yachtId, 1));
      }
      return {
        success: true,
        message: response.data.message || "Đánh giá đã được gửi thành công",
        data: response.data.data,
      };
    } else {
      const errorMsg = response.data?.message || "Submit failed";
      dispatch(submitReviewFailure(errorMsg));
      return { success: false, message: errorMsg };
    }
  } catch (error) {
    let errorMessage = "Không thể gửi đánh giá, vui lòng thử lại.";
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "Không thể kết nối đến server";
    } else {
      errorMessage = error.message;
    }
    dispatch(submitReviewFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};
