import axios from "axios";
import Swal from "sweetalert2";
import {
  fetchYachtRequest,
  fetchYachtSuccess,
  fetchYachtFailure,
  fetchImagesRequest,
  fetchImagesSuccess,
  fetchImagesFailure,
  fetchRoomsRequest,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  submitReviewRequest,
  submitReviewSuccess,
  submitReviewFailure,
  requestConsultationRequest,
  requestConsultationSuccess,
  requestConsultationFailure,
  setSubmitting,
  setAuthenticated,
} from "./action";

// === YACHT ASYNC ACTIONS ===
export const fetchYachtById = (yachtId) => async (dispatch) => {
  dispatch(fetchYachtRequest());
  try {
    const [yachtResponse, servicesResponse] = await Promise.all([
      axios.get(`http://localhost:9999/api/v1/yachts/findboat/${yachtId}`),
      axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/services`),
    ]);
    const yachtData = {
      ...yachtResponse.data.data,
      services: Array.isArray(servicesResponse.data?.data)
        ? servicesResponse.data.data
        : [],
    };
    dispatch(fetchYachtSuccess(yachtData));
  } catch (error) {
    dispatch(fetchYachtFailure(error.message));
  }
};

//=== SERVICE ASYNC ACTIONS ===
export const fetchServices = (yachtId) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_SERVICES_REQUEST" });
    const response = await axios.get(
      `http://localhost:9999/api/v1/yachts/${yachtId}/services`
    );
    console.log("fetchServices response:", response.data); // Debug log
    const servicesData = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    console.log("Processed services data:", servicesData); // Debug log
    dispatch({ type: "FETCH_SERVICES_SUCCESS", payload: servicesData });
  } catch (error) {
    console.error("fetchServices error:", error); // Debug log
    dispatch({ type: "FETCH_SERVICES_FAILURE", payload: error.message });
  }
};

// === IMAGE ASYNC ACTIONS ===
export const fetchYachtImages = (yachtId) => async (dispatch) => {
  dispatch(fetchImagesRequest());
  try {
    const response = await axios.get(
      `http://localhost:9999/api/v1/yachtImages/yacht/${yachtId}`
    );
    const images = response.data.data || [];
    const processedImages =
      images.length > 0
        ? images.map((url, idx) => ({
            src: url,
            alt: `Yacht image ${idx + 1}`,
          }))
        : [{ src: "./images/yacht-8.jpg", alt: "Default Image" }];
    dispatch(fetchImagesSuccess(processedImages));
  } catch (error) {
    dispatch(fetchImagesFailure(error.message));
    dispatch(
      fetchImagesSuccess([
        { src: "./images/yacht-8.jpg", alt: "Default Image" },
      ])
    );
  }
};

// === BOOKING ASYNC ACTIONS ===
export const fetchRoomsAndSchedules =
  (yachtId, scheduleId) => async (dispatch) => {
    dispatch(fetchRoomsRequest());
    try {
      const [roomsResponse, schedulesResponse] = await Promise.all([
        axios.get("http://localhost:9999/api/v1/rooms", {
          params: { yachtId, scheduleId },
        }),
        axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/schedules`),
      ]);
      dispatch(
        fetchRoomsSuccess(
          roomsResponse.data.data.rooms,
          schedulesResponse.data.data
        )
      );
    } catch (error) {
      dispatch(fetchRoomsFailure(error.message));
    }
  };

//=== CONSULTATION ASYNC ACTIONS ===
export const submitRoomBooking = (bookingData) => async (dispatch) => {
  dispatch(setSubmitting(true));
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }
    const response = await axios.post(
      "http://localhost:9999/api/v1/bookings/rooms",
      bookingData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.data.success) {
      dispatch(setSubmitting(false));
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Đặt phòng thất bại.");
    }
  } catch (error) {
    dispatch(setSubmitting(false));
    const errorMessage =
      error.response?.data?.message || error.message || "Đặt phòng thất bại.";
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: errorMessage,
      confirmButtonText: "OK",
    });
    return { success: false, error: errorMessage };
  }
};

export const submitCharterBooking = (bookingData) => async (dispatch) => {
  dispatch(setSubmitting(true));
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }
    const response = await axios.post(
      "http://localhost:9999/api/v1/bookings/charter",
      bookingData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.data.success) {
      dispatch(setSubmitting(false));
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Đặt tàu thất bại.");
    }
  } catch (error) {
    dispatch(setSubmitting(false));
    const errorMessage =
      error.response?.data?.message || error.message || "Đặt tàu thất bại.";
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: errorMessage,
      confirmButtonText: "OK",
    });
    return { success: false, error: errorMessage };
  }
};

export const requestConsultation = (consultationData) => async (dispatch) => {
  dispatch(requestConsultationRequest());
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực.");
    }
    const response = await axios.post(
      "http://localhost:9999/api/v1/consultation",
      consultationData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.data.success) {
      dispatch(requestConsultationSuccess());
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Yêu cầu tư vấn thất bại.");
    }
  } catch (error) {
    dispatch(requestConsultationFailure(error.message));
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Yêu cầu tư vấn thất bại.";
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: errorMessage,
      confirmButtonText: "OK",
    });
    return { success: false, error: errorMessage };
  }
};

// === REVIEW ASYNC ACTIONS ===
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
          // Xử lý date với support cho DD/MM/YYYY format
          let formattedDate = "N/A";
          const dateFields = ["createdAt", "created_at", "date", "reviewDate"];
          for (const field of dateFields) {
            if (review[field]) {
              try {
                let dateValue = review[field];
                // Xử lý MongoDB date structure
                if (typeof dateValue === "object" && dateValue.$date) {
                  dateValue = dateValue.$date;
                }
                if (typeof dateValue === "string") {
                  // Kiểm tra nếu đã là format DD/MM/YYYY
                  const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                  const ddmmyyyyMatch = dateValue.match(ddmmyyyyPattern);
                  if (ddmmyyyyMatch) {
                    // Nếu đã là DD/MM/YYYY, dùng trực tiếp
                    formattedDate = dateValue;
                    break;
                  } else {
                    // Thử parse ISO format hoặc các format khác
                    const date = new Date(dateValue);
                    if (!isNaN(date.getTime())) {
                      formattedDate = date.toLocaleDateString("vi-VN");
                      break;
                    }
                  }
                } else {
                  // Number timestamp hoặc Date object
                  const date = new Date(dateValue);
                  if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString("vi-VN");
                    break;
                  }
                }
              } catch (error) {
                console.error(`Date parsing error for field ${field}:`, error);
              }
            }
          }
          // Thử nhiều cách để lấy userName
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
      customerId: reviewData.customerId, // Thêm customerId vào request
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

    // Kiểm tra response.data.success thay vì response.success
    if (response.data && response.data.success === true) {
      dispatch(submitReviewSuccess());

      // Refresh reviews list
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
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Không thể kết nối đến server";
    } else {
      // Something else happened
      errorMessage = error.message;
    }

    dispatch(submitReviewFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};

export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("customer");
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(setAuthenticated(userData));
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
    }
  }
};

// Thêm vào asyncActions.js
export const fetchCustomerIdFromStorage = () => (dispatch) => {
  try {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const parsedCustomer = JSON.parse(customerData);

      // Dispatch customer data vào Redux
      dispatch(setAuthenticated(parsedCustomer));

      console.log("Customer data loaded to Redux:", parsedCustomer);
      return parsedCustomer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer from storage:", error);
    return null;
  }
};
