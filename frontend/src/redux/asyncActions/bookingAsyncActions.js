import axios from "axios";
import Swal from "sweetalert2";
import * as bookingActions from "../actions/bookingActions";
import { resetBookingForm } from "../actions/bookingActions";
import {
  closeBookingModal,
  closeConfirmationModal,
  openConfirmationModal,
  openTransactionModal,
  setSubmitting,
} from "../actions/uiActions";

export const fetchRoomsAndSchedules =
  (yachtId, scheduleId) => async (dispatch) => {
    dispatch(bookingActions.fetchRoomsRequest());
    if (!scheduleId) {
      dispatch(
        bookingActions.fetchRoomsFailure(
          "Vui lòng chọn lịch trình trước khi xem phòng."
        )
      );
      return;
    }
    try {
      const [roomsResponse, schedulesResponse] = await Promise.all([
        axios.get("http://localhost:9999/api/v1/rooms", {
          params: { yachtId, scheduleId },
        }),
        axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/schedules`),
      ]);

      const formattedSchedules = schedulesResponse.data.data.map((schedule) => {
        const startDateRaw = schedule.scheduleId?.startDate;
        const endDateRaw = schedule.scheduleId?.endDate;

        const startDate = startDateRaw ? new Date(startDateRaw) : null;
        const endDate = endDateRaw ? new Date(endDateRaw) : null;

        if (
          !startDate ||
          isNaN(startDate.getTime()) ||
          !endDate ||
          isNaN(endDate.getTime())
        ) {
          console.error(
            "Invalid date for schedule ID:",
            schedule.scheduleId?._id
          );
          return {
            ...schedule,
            durationText: "Không xác định",
            displayText: "Không xác định",
          };
        }

        const formatDate = (date) => {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const durationDays = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        const durationNights = durationDays - 1;
        const durationText = `${durationDays} ngày ${durationNights} đêm`;
        //lịch trình X ngày Y đêm (từ ngày/tháng/năm đến ngày/tháng/năm
        const displayText = `${durationText} (từ ${formattedStartDate} đến ${formattedEndDate})`;

        return {
          ...schedule,
          durationText: durationText,
          displayText: displayText,
        };
      });

      dispatch(
        bookingActions.fetchRoomsSuccess(
          roomsResponse.data.data.rooms,
          formattedSchedules
        )
      );
    } catch (error) {
      dispatch(bookingActions.fetchRoomsFailure(error.message));
    }
  };

export const updateBookingOrConsultationRequest =
  (bookingId, bookingData, requestType) => async (dispatch, getState) => {
    dispatch(bookingActions.genericBookingRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const { selectedSchedule } = getState().booking;
      const requestPayload = {
        ...bookingData,
        scheduleId: selectedSchedule || bookingData.scheduleId || null,
        requestType: requestType,
      };

      const response = await axios.put(
        `http://localhost:9999/api/v1/bookings/request/${bookingId}`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const updatedBookingOrder = response.data.data;
        // Merge thông tin phòng/dịch vụ vào consultationData nếu là tư vấn (chưa xác nhận booking)
        let consultationPayload = updatedBookingOrder;
        if (requestType !== "pending_payment") {
          const { selectedYachtServices } = getState().booking;
          consultationPayload = {
            ...updatedBookingOrder,
            consultationData: {
              requestedRooms: bookingData.selectedRooms || [],
              requestServices: selectedYachtServices || [],
              estimatedPrice: bookingData.totalPrice || 0,
            },
          };
        }
        dispatch(bookingActions.genericBookingSuccess(consultationPayload));
        dispatch(setSubmitting(false));
        dispatch(closeBookingModal());
        if (requestType === "pending_payment") {
          const { guestCounter } = getState().booking;
          const confirmationModalData = {
            ...bookingData,
            bookingId: updatedBookingOrder.bookingId || updatedBookingOrder._id,
            bookingCode: updatedBookingOrder.bookingCode,
            scheduleId: selectedSchedule || bookingData.scheduleId || null,
            isDirectBooking: true,
            amountToPay:
              updatedBookingOrder.paymentBreakdown?.depositAmount > 0
                ? updatedBookingOrder.paymentBreakdown.depositAmount
                : updatedBookingOrder.amount,
            paymentTypeForConfirmation:
              updatedBookingOrder.paymentBreakdown?.depositAmount > 0
                ? "deposit"
                : "full",
            adults: guestCounter.adults,
            childrenUnder10: guestCounter.childrenUnder10,
            childrenAbove10: guestCounter.childrenAbove10,
          };
          dispatch(openConfirmationModal(confirmationModalData));
        } else {
          Swal.fire({
            icon: "success",
            title: "Cập nhật yêu cầu tư vấn thành công!",
            text: "Chúng tôi sẽ liên hệ lại với bạn.",
            showConfirmButton: false,
            timer: 2500,
          });
          dispatch(resetBookingForm());
        }
        return { success: true, data: consultationPayload };
      } else {
        throw new Error(response.data.message || "Cập nhật yêu cầu thất bại.");
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(bookingActions.genericBookingFailure(errorMessage));
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

export const createBookingOrConsultationRequest =
  (bookingData, requestType) => async (dispatch, getState) => {
    dispatch(bookingActions.genericBookingRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }
      const { selectedSchedule, selectedYachtServices } = getState().booking;
      // Lấy startDate của lịch trình
      let checkInDate = null;
      if (selectedSchedule && typeof selectedSchedule === 'object' && selectedSchedule.scheduleId?.startDate) {
        checkInDate = selectedSchedule.scheduleId.startDate;
      } else if (bookingData.scheduleObj?.scheduleId?.startDate) {
        checkInDate = bookingData.scheduleObj.scheduleId.startDate;
      } else if (bookingData.checkInDate) {
        checkInDate = bookingData.checkInDate;
      }
      const requiredFields = [
        "yachtId",
        "fullName",
        "email",
        "phoneNumber",
        "guestCount",
      ];
      const missingFields = requiredFields.filter(
        (field) => !bookingData[field]
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`
        );
      }
      if (
        !bookingData.selectedRooms ||
        bookingData.selectedRooms.length === 0
      ) {
        throw new Error("Vui lòng chọn ít nhất một phòng.");
      }
      if (
        requestType === "pending_payment" &&
        (!bookingData.totalPrice || bookingData.totalPrice <= 0)
      ) {
        throw new Error("Tổng giá phải lớn hơn 0 cho đặt trực tiếp.");
      }
      // Map selectedRooms và selectedServices đúng định dạng ref
      const roomsForApi = (bookingData.selectedRooms || []).map((room) => ({
        roomId: room.roomId || room.id,
        quantity: room.roomQuantity || room.quantity || 1,
        roomPrice: room.roomPrice !== undefined ? room.roomPrice : room.price,
      }));
      const servicesForApi = (selectedYachtServices || []).map((service) => ({
        serviceId: service.serviceId || service.id,
        quantity: service.serviceQuantity || service.quantity || 1,
      }));
      const requestPayload = {
        ...bookingData,
        selectedRooms: roomsForApi,
        selectedServices: servicesForApi,
        scheduleId: selectedSchedule || bookingData.scheduleId || null,
        checkInDate, // luôn truyền checkInDate
        requestType: requestType,
      };
      const response = await axios.post(
        "http://localhost:9999/api/v1/bookings/request",
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        const createdBookingOrder = response.data.data;
        let consultationPayload = createdBookingOrder;
        if (requestType !== "pending_payment") {
          consultationPayload = {
            ...createdBookingOrder,
            consultationData: {
              requestedRooms: bookingData.selectedRooms || [],
              requestServices: selectedYachtServices || [],
              estimatedPrice: bookingData.totalPrice || 0,
              requirements: bookingData.requirements,
            },
          };
        }
        dispatch(bookingActions.genericBookingSuccess(consultationPayload));
        dispatch(setSubmitting(false));
        dispatch(closeBookingModal());
        if (requestType === "pending_payment") {
          const { guestCounter } = getState().booking;
          const confirmationModalData = {
            ...bookingData,
            bookingId: createdBookingOrder.bookingId || createdBookingOrder._id,
            bookingCode: createdBookingOrder.bookingCode,
            scheduleId: selectedSchedule || bookingData.scheduleId || null,
            isDirectBooking: true,
            amountToPay:
              createdBookingOrder.paymentBreakdown?.depositAmount > 0
                ? createdBookingOrder.paymentBreakdown.depositAmount
                : createdBookingOrder.amount,
            paymentTypeForConfirmation:
              createdBookingOrder.paymentBreakdown?.depositAmount > 0
                ? "deposit"
                : "full",
            adults: guestCounter.adults,
            childrenUnder10: guestCounter.childrenUnder10,
            childrenAbove10: guestCounter.childrenAbove10,
          };
          dispatch(openConfirmationModal(confirmationModalData));
        } else {
          Swal.fire({
            icon: "success",
            title: "Đăng ký tư vấn thành công!",
            text: "Chúng tôi sẽ liên hệ với bạn để tư vấn chi tiết.",
            showConfirmButton: false,
            timer: 2500,
          });
          dispatch(closeBookingModal());
          dispatch(resetBookingForm());
        }
        return { success: true, data: consultationPayload };
      } else {
        throw new Error(
          response.data.message || `Yêu cầu (${requestType}) thất bại.`
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage =
        error.response?.data?.message || error.message || "Yêu cầu thất bại.";
      dispatch(bookingActions.genericBookingFailure(errorMessage));
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

export const fetchConsultationRequest =
  (yachtId, checkInDate) => async (dispatch) => {
    dispatch({ type: "FETCH_CONSULTATION_REQUEST" });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }
      const params = { yachtId };
      if (checkInDate) {
        params.checkInDate = checkInDate;
      }
      const response = await axios.get(
        "http://localhost:9999/api/v1/bookings/consultation",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        dispatch({
          type: "FETCH_CONSULTATION_SUCCESS",
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: "FETCH_CONSULTATION_FAILURE",
          payload: response.data.message,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch({
          type: "FETCH_CONSULTATION_FAILURE",
          payload: null,
        });
      } else {
        dispatch({
          type: "FETCH_CONSULTATION_FAILURE",
          payload: error.message,
        });
      }
    }
  };

export const cancelConsultationRequestById =
  (bookingId) => async (dispatch) => {
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const response = await axios.delete(
        `http://localhost:9999/api/v1/bookings/consultation/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        dispatch(bookingActions.clearConsultation());
        dispatch(setSubmitting(false));
        dispatch(resetBookingForm());
        Swal.fire({
          icon: "success",
          title: "Đã hủy yêu cầu tư vấn!",
          text: "Bạn có thể gửi một yêu cầu mới nếu muốn.",
          showConfirmButton: false,
          timer: 2500,
        });
        return { success: true };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      Swal.fire({ icon: "error", title: "Lỗi!", text: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

export const customerConfirmConsultation =
  (bookingId) => async (dispatch, getState) => {
    dispatch(setSubmitting(true));
    dispatch(bookingActions.confirmConsultationRequest());
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const response = await axios.post(
        `http://localhost:9999/api/v1/bookings/${bookingId}/confirm-consultation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const updatedBookingData = response.data.data;
        dispatch(bookingActions.confirmConsultationSuccess(updatedBookingData));
        dispatch(setSubmitting(false));
        dispatch(closeConfirmationModal());
        const bookingDetailResult = await dispatch(
          fetchCustomerBookingDetail(bookingId)
        );
        if (bookingDetailResult.success) {
          dispatch(openTransactionModal(bookingId));
          Swal.fire({
            icon: "success",
            title: "Đã xác nhận tư vấn!",
            text: "Booking đã được cập nhật. Vui lòng tiến hành thanh toán.",
            confirmButtonText: "OK",
          });
          dispatch(resetBookingForm());
          return { success: true, data: updatedBookingData };
        } else {
          throw new Error(
            "Không thể lấy thông tin chi tiết booking sau khi xác nhận tư vấn."
          );
        }
      } else {
        throw new Error(
          response.data.message || "Xác nhận booking sau tư vấn thất bại."
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(bookingActions.confirmConsultationFailure(errorMessage));
      Swal.fire({
        icon: "error",
        title: "Lỗi xác nhận!",
        text: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

export const customerCancelBooking = (bookingId) => async (dispatch) => {
  dispatch(setSubmitting(true));
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");
    const response = await axios.put(
      `http://localhost:9999/api/v1/bookings/${bookingId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      dispatch(
        bookingActions.updateBookingStatusInList(bookingId, "cancelled")
      );
      dispatch(closeConfirmationModal());
      dispatch(closeBookingModal());
      dispatch(setSubmitting(false));
      Swal.fire({
        icon: "info",
        title: "Đã hủy booking",
        text: "Booking của bạn đã được hủy thành công.",
      });
      dispatch(fetchCustomerBookings());
      return { success: true };
    } else {
      throw new Error(response.data.message || "Hủy booking thất bại.");
    }
  } catch (error) {
    dispatch(setSubmitting(false));
    const errorMessage = error.response?.data?.message || error.message;
    Swal.fire({ icon: "error", title: "Lỗi hủy booking!", text: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const fetchCustomerBookings = () => async (dispatch) => {
  dispatch({ type: "FETCH_CUSTOMER_BOOKINGS_REQUEST" });
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");
    const response = await axios.get(
      "http://localhost:9999/api/v1/bookings/my-bookings",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.data.success) {
      dispatch({
        type: "FETCH_CUSTOMER_BOOKINGS_SUCCESS",
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Lỗi lấy danh sách booking");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: "FETCH_CUSTOMER_BOOKINGS_FAILURE",
      payload: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

export const fetchCustomerBookingDetail = (bookingId) => async (dispatch) => {
  dispatch(bookingActions.fetchBookingDetailRequest());
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");
    const response = await axios.get(
      `http://localhost:9999/api/v1/bookings/${bookingId}/my-detail`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      let detail = response.data.data;
      // Đảm bảo luôn có mảng (nếu backend không trả về thì gán mảng rỗng)
      detail.bookedRooms = detail.bookedRooms || [];
      detail.bookedServices = detail.bookedServices || [];
      dispatch(bookingActions.fetchBookingDetailSuccess(detail));
      return { success: true, data: detail };
    } else {
      throw new Error(response.data.message || "Lỗi lấy chi tiết booking");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(bookingActions.fetchBookingDetailFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const deleteBookingById = (bookingId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token xác thực.");
    const response = await axios.delete(
      `http://localhost:9999/api/v1/bookings/${bookingId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      dispatch(fetchCustomerBookings());
      Swal.fire({
        icon: "success",
        title: "Đã xóa booking!",
        text: "Booking đã được xóa thành công.",
        timer: 2000,
        showConfirmButton: false,
      });
      return { success: true };
    } else {
      throw new Error(response.data.message || "Xóa booking thất bại.");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    Swal.fire({ icon: "error", title: "Lỗi xóa booking!", text: errorMessage });
    return { success: false, error: errorMessage };
  }
};

// Action chỉ lấy schedules
export const fetchSchedulesOnly = (yachtId) => async (dispatch) => {
  dispatch(bookingActions.fetchSchedulesRequest());
  try {
    const schedulesResponse = await axios.get(
      `http://localhost:9999/api/v1/yachts/${yachtId}/schedules`
    );
    const formattedSchedules = schedulesResponse.data.data.map((schedule) => {
      const startDateRaw = schedule.scheduleId?.startDate;
      const endDateRaw = schedule.scheduleId?.endDate;
      const startDate = startDateRaw ? new Date(startDateRaw) : null;
      const endDate = endDateRaw ? new Date(endDateRaw) : null;
      if (
        !startDate ||
        isNaN(startDate.getTime()) ||
        !endDate ||
        isNaN(endDate.getTime())
      ) {
        return {
          ...schedule,
          durationText: "Không xác định",
          displayText: "Không xác định",
        };
      }
      const formatDate = (date) =>
        `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const durationDays = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const durationNights = durationDays - 1;
      const durationText = `${durationDays} ngày ${durationNights} đêm`;
      const displayText = `${durationText} (từ ${formattedStartDate} đến ${formattedEndDate})`;
      return { ...schedule, durationText, displayText };
    });
    dispatch(
      bookingActions.fetchSchedulesSuccess({
        yachtId,
        schedules: formattedSchedules,
      })
    );
  } catch (error) {
    dispatch(bookingActions.fetchSchedulesFailure(error.message));
  }
};

// Action chỉ lấy rooms
export const fetchRoomsOnly = (yachtId, scheduleId) => async (dispatch) => {
  dispatch(bookingActions.fetchRoomsRequest());
  try {
    const roomsResponse = await axios.get(
      "http://localhost:9999/api/v1/rooms",
      {
        params: { yachtId, scheduleId },
      }
    );
    dispatch(
      bookingActions.fetchRoomsSuccess(roomsResponse.data.data.rooms, [])
    );
  } catch (error) {
    dispatch(bookingActions.fetchRoomsFailure(error.message));
  }
};

// Các async action booking khác (fetchConsultationRequest, cancelConsultationRequestById, customerConfirmConsultation, customerCancelBooking, fetchCustomerBookings, fetchCustomerBookingDetail, ...) cũng cần được bổ sung tương tự từ file gốc nếu cần.
