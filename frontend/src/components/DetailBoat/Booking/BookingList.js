import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerBookings } from "../../redux/asyncActions";
import { formatPrice } from "../../redux/validation";

const BookingList = () => {
  const dispatch = useDispatch();
  const { customerBookings, customerBookingsLoading, customerBookingsError } =
    useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchCustomerBookings());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "green";
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      case "consultation_requested":
        return "purple";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      case "consultation_requested":
        return "Yêu cầu tư vấn";
      default:
        return status;
    }
  };

  const handleViewDetail = (bookingId) => {
    // Có thể chuyển đến trang chi tiết hoặc mở modal
    window.location.href = `/booking-detail/${bookingId}`;
  };

  const handleCancelBooking = (bookingId) => {};

  if (customerBookingsLoading) {
    return (
      <div className="booking-list-loading">
        <div className="loading-spinner">
          <p>Đang tải danh sách booking...</p>
        </div>
      </div>
    );
  }

  if (customerBookingsError) {
    return (
      <div className="booking-list-error">
        <div className="error-message">
          <p>Lỗi: {customerBookingsError}</p>
          <button
            onClick={() => dispatch(fetchCustomerBookings())}
            className="retry-btn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-list">
      <h2>Danh sách booking của tôi</h2>

      {customerBookings.length === 0 ? (
        <div className="no-bookings">
          <p>Bạn chưa có booking nào.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {customerBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.yacht?.name || "Du thuyền"}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="booking-info">
                <p>
                  <strong>Mã booking:</strong> {booking._id}
                </p>
                <p>
                  <strong>Ngày check-in:</strong>{" "}
                  {booking.checkInDate
                    ? new Date(booking.checkInDate).toLocaleDateString("vi-VN")
                    : "Chưa xác định"}
                </p>
                <p>
                  <strong>Số khách:</strong>{" "}
                  {booking.guestCount || "Chưa xác định"}
                </p>
                <p>
                  <strong>Tổng tiền:</strong> {formatPrice(booking.amount)}
                </p>

                {(booking.consultationData?.requirements ||
                  booking.requirements) && (
                  <p>
                    <strong>Yêu cầu:</strong>{" "}
                    {booking.consultationData?.requirements ||
                      booking.requirements}
                  </p>
                )}

                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(booking.create_time).toLocaleDateString("vi-VN")}
                </p>

                {/* Hiển thị thông tin consultation nếu có */}
                {booking.status === "consultation_requested" &&
                  booking.consultationData && (
                    <div className="consultation-info">
                      <p>
                        <strong>Giá ước tính:</strong>{" "}
                        {formatPrice(
                          booking.consultationData.estimatedPrice || 0
                        )}
                      </p>
                      {booking.consultationData.notes && (
                        <p>
                          <strong>Ghi chú:</strong>{" "}
                          {booking.consultationData.notes}
                        </p>
                      )}
                    </div>
                  )}
              </div>

              <div className="booking-actions">
                <button
                  className="btn-detail"
                  onClick={() => handleViewDetail(booking._id)}
                >
                  Xem chi tiết
                </button>

                {booking.status === "pending" && (
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Hủy booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;
