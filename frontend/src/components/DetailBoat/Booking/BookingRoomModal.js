import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ArrowRight, Edit, Calendar as CalendarIcon } from "lucide-react";
import { Box, TextField, Typography, Button } from "@mui/material";
import GuestCounter from "./GuestCounter";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  validateBookingForm,
  validateRoomSelection,
} from "../../../redux/validation";
import {
  cancelConsultationRequestById,
  createBookingOrConsultationRequest,
  fetchConsultationRequest,
  updateBookingOrConsultationRequest,
  fetchRoomsOnly, // thêm dòng này
} from "../../../redux/asyncActions/bookingAsyncActions";
import ConsultationDetailsModal from "./ConsultationDetailModal";
import {
  clearAllErrors,
  resetBookingForm,
  setBookingErrors,
  setEditingBookingId,
  setGuestCounter,
  updateBookingForm,
  updateRooms,
  setSelectedYachtServices,
} from "../../../redux/actions/bookingActions";
import { closeBookingModal } from "../../../redux/actions";
import RoomServicesModal from "../RoomServicesModal";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useTheme } from "@mui/material/styles";

// Thêm biến màu lấy từ theme
const getDatePickerThemeVars = (theme) => `
  :root {
    --datepicker-bg: ${theme.palette.background.paper};
    --datepicker-header-bg: ${theme.palette.primary.light};
    --datepicker-header-color: ${theme.palette.text.primary};
    --datepicker-border: ${theme.palette.primary.main};
    --datepicker-selected-bg: ${theme.palette.primary.main};
    --datepicker-selected-color: ${theme.palette.text.primary};
    --datepicker-hover-bg: ${theme.palette.primary.light};
    --datepicker-hover-color: ${theme.palette.text.primary};
    --datepicker-today-border: ${theme.palette.secondary.main};
    --datepicker-label: ${theme.palette.primary.main};
    --datepicker-error: ${theme.palette.error.main};
    --datepicker-divider: ${theme.palette.divider};
 --datepicker-disabled: ${
   theme.palette.text.disabled || theme.palette.text.secondary
 };
  }
`;

const BookingRoomModal = ({
  show,
  yachtData,
  selectedRooms,
  selectedYachtServices,
  onClose,
  maxPeople,
  selectedSchedule: propSelectedSchedule,
  onUpdateSelectedRooms,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    bookingForm,
    bookingErrors,
    submitting,
    consultation,
    hasConsultation,
    editingBookingId,
    guestCounter,
  } = useSelector((state) => state.booking);
  const authCustomer = useSelector((state) => state.account.account.customer); // Sửa thành state.account.account.customer
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const rooms = useSelector((state) => state.booking.rooms);
  const services = useSelector((state) => state.services.data);
  const allSchedules = useSelector((state) => state.booking.schedules);
  const scheduleList = allSchedules[yachtData?._id] || [];
  const selectedScheduleObj = scheduleList.find(
    (s) => s._id === propSelectedSchedule || s.id === propSelectedSchedule
  );
  // console.log(selectedScheduleObj?.scheduleId?.startDate);
  console.log(consultation);

  const adults = Number(guestCounter?.adults ?? 0);
  const childrenAbove10 = Number(guestCounter?.childrenAbove10 ?? 0);
  const totalGuests = adults + Math.floor(childrenAbove10 / 2);
  // Đảm bảo tính tổng tiền phòng đúng logic
  const totalRoomPrice = (selectedRooms || []).reduce(
    (sum, room) => sum + (room.price || 0) * (room.quantity || 0),
    0
  );
  const totalServicePrice = selectedYachtServices
    ? selectedYachtServices.reduce(
        (sum, sv) => sum + sv.price * (sv.quantity || 1),
        0
      )
    : 0;

  // Kiểm tra trạng thái booking
  const getBookingStatus = () => {
    if (!consultation?.data) return null;
    const status = consultation.data.status || consultation.data.bookingStatus;
    return status;
  };

  const isBookingActive = () => {
    const status = getBookingStatus();
    if (!status) return false;

    // Các trạng thái chưa hoàn thành
    const activeStatuses = [
      "consultation_requested",
      "consultation_sent",
      "pending_payment",
      "confirmed",
    ];

    const active = activeStatuses.includes(status);

    return active;
  };

  const getBookingButtonText = () => {
    const status = getBookingStatus();
    if (!status) return "Đặt ngay";

    let buttonText;
    switch (status) {
      case "consultation_requested":
        buttonText = "Đã đăng ký tư vấn";
        break;
      case "consultation_sent":
        buttonText = "Đã nhận tư vấn";
        break;
      case "pending_payment":
        buttonText = "Chờ thanh toán";
        break;
      case "confirmed":
        buttonText = "Đã xác nhận đặt";
        break;
      case "completed":
        buttonText = "Đặt ngay";
        break;
      case "cancelled":
      case "rejected":
        buttonText = "Đặt ngay";
        break;
      default:
        buttonText = "Đặt ngay";
    }

    return buttonText;
  };

  const handleBookingButtonClick = () => {
    if (isBookingActive()) {
      navigate("/booking-history");
      dispatch(closeBookingModal());
      return;
    }
    handleSubmit("pending_payment");
  };

  useEffect(() => {
    if (show && yachtData?._id) {
      dispatch(fetchConsultationRequest(yachtData._id));
    }
  }, [show, yachtData, dispatch]);

  useEffect(() => {
    if (show && authCustomer) {
      if (!bookingForm.fullName)
        dispatch(updateBookingForm("fullName", authCustomer.fullName || ""));
      if (!bookingForm.phoneNumber)
        dispatch(
          updateBookingForm("phoneNumber", authCustomer.phoneNumber || "")
        );
      if (!bookingForm.email)
        dispatch(updateBookingForm("email", authCustomer.email || ""));
      if (!bookingForm.address)
        dispatch(updateBookingForm("address", authCustomer.address || ""));
    }
  }, [show, authCustomer]);

  useEffect(() => {
    if (show) {
      const minAdults = selectedRooms.reduce(
        (sum, room) => sum + (room.quantity || 0),
        0
      );
      if (guestCounter.adults < minAdults) {
        window.Swal &&
          Swal.fire({
            icon: "warning",
            title: "Số người lớn không được nhỏ hơn tổng số phòng!",
            text: `Bạn đã chọn ${minAdults} phòng, cần ít nhất ${minAdults} người lớn.`,
          });
        dispatch(
          setGuestCounter({
            ...guestCounter,
            adults: minAdults,
          })
        );
        // Cập nhật luôn text hiển thị
        let guestCountText = `${minAdults} người lớn`;
        if (guestCounter.childrenAbove10 > 0)
          guestCountText += `, ${guestCounter.childrenAbove10} trẻ em từ 10 tuổi`;
        if (guestCounter.childrenUnder10 > 0)
          guestCountText += `, ${guestCounter.childrenUnder10} trẻ em dưới 10 tuổi (không tính vào tổng khách)`;
        dispatch({
          type: "UPDATE_BOOKING_FORM",
          payload: { field: "guestCount", value: guestCountText },
        });
      }
      // Không ép adults về minAdults nếu họ đang chọn nhiều hơn
    }
  }, [show, selectedRooms]);

  const handleInputChange = (field, value) => {
    dispatch(updateBookingForm(field, value));
    if (bookingErrors[field]) {
      dispatch(setBookingErrors({ [field]: null }));
    }
  };

  const validateAllForms = () => {
    if (!propSelectedSchedule) {
      Swal.fire({
        icon: "error",
        title: "Thiếu lịch trình!",
        text: "Vui lòng chọn lịch trình trước khi đặt phòng.",
      });
      return false;
    }
    const roomValidation = validateRoomSelection(
      selectedRooms,
      propSelectedSchedule,
      bookingForm.guestCount
    );

    const allErrors = { ...roomValidation.errors };
    if (Object.keys(allErrors).length > 0) {
      dispatch(setBookingErrors(allErrors));
      const firstError = Object.values(allErrors)[0];
      Swal.fire({
        icon: "error",
        title: "Thông tin chưa hợp lệ!",
        text: firstError,
      });
      return false;
    }
    dispatch(clearAllErrors());
    return true;
  };

  const prepareSharedBookingData = () => {
    const childrenUnder10 = Number(guestCounter?.childrenUnder10 ?? 0);
    const totalPrice = totalRoomPrice + totalServicePrice;

    // Sử dụng selectedRooms từ props thay vì rooms từ Redux state
    const mappedRooms = selectedRooms.map((room) => ({
      roomId: room.roomId || room.id,
      roomName: room.roomName || room.name,
      roomPrice: room.roomPrice !== undefined ? room.roomPrice : room.price,
      roomQuantity:
        room.roomQuantity !== undefined ? room.roomQuantity : room.quantity,
      roomDescription: room.roomDescription || room.description,
      roomArea: room.roomArea || room.area,
      roomAvatar: room.roomAvatar || room.avatar,
      roomMaxPeople: room.roomMaxPeople || room.max_people,
      roomImage:
        room.roomImage ||
        (room.images && room.images.length > 0
          ? room.images[0]
          : room.avatar || ""),
    }));

    const mappedServices = (selectedYachtServices || []).map((sv) => ({
      serviceId: sv.serviceId || sv._id || sv.id,
      serviceName: sv.serviceName || sv.name,
      servicePrice: sv.servicePrice !== undefined ? sv.servicePrice : sv.price,
      quantity: sv.quantity !== undefined ? sv.quantity : 1,
    }));

    const checkInDate = selectedScheduleObj?.startDate
      ? new Date(selectedScheduleObj.startDate).toISOString()
      : selectedScheduleObj?.scheduleId?.startDate
      ? new Date(selectedScheduleObj.scheduleId.startDate).toISOString()
      : undefined;

    return {
      fullName: bookingForm.fullName,
      phoneNumber: bookingForm.phoneNumber,
      email: bookingForm.email,
      guestCount: totalGuests,
      adults,
      childrenUnder10,
      childrenAbove10,
      requirements: bookingForm.requirements || "",
      address: bookingForm.address || "",
      selectedRooms: mappedRooms,
      totalPrice,
      yachtId: yachtData._id,
      scheduleId: propSelectedSchedule || null,
      bookingId: consultation?.data?.bookingId || null,
      selectedServices: mappedServices,
      checkInDate, // Thêm checkInDate vào payload
    };
  };

  const handleSubmit = async (requestType) => {
    if (!validateAllForms()) return;
    const sharedData = prepareSharedBookingData();
    let result;
    if (editingBookingId) {
      const { bookingId, ...dataForUpdate } = sharedData;
      result = await dispatch(
        updateBookingOrConsultationRequest(
          editingBookingId,
          dataForUpdate,
          requestType
        )
      );
      dispatch(setEditingBookingId(null));
    } else {
      result = await dispatch(
        createBookingOrConsultationRequest(sharedData, requestType)
      );
    }

    if (result && result.payload && result.payload.success) {
      dispatch(resetBookingForm());
      dispatch(clearAllErrors());
      dispatch(setEditingBookingId(null));
      dispatch({ type: "CLEAR_SELECTION" });
      dispatch({ type: "SET_SELECTED_SCHEDULE", payload: "" });
      dispatch({ type: "SET_SELECTED_MAX_PEOPLE", payload: "all" });
      if (yachtData?._id) {
        dispatch(fetchConsultationRequest(yachtData._id));
      }
      // Refetch lại danh sách phòng để cập nhật số lượng mới nhất
      if (yachtData?._id && propSelectedSchedule) {
        dispatch(fetchRoomsOnly(yachtData._id, propSelectedSchedule));
      }
      dispatch(closeBookingModal());
    }
  };

  const handleEditConsultation = () => {
    if (consultation?.data) {
      dispatch(setEditingBookingId(consultation.data.bookingId));
      dispatch(updateBookingForm("fullName", consultation.data.fullName));
      dispatch(updateBookingForm("phoneNumber", consultation.data.phoneNumber));
      dispatch(updateBookingForm("email", consultation.data.email));
      dispatch(updateBookingForm("address", consultation.data.address || ""));
      dispatch(
        updateBookingForm("requirements", consultation.data.requirements || "")
      );
      const childrenUnder10 = consultation?.data?.childrenUnder10 ?? 0;
      dispatch(
        setGuestCounter({
          adults: consultation?.data?.adults ?? 1,
          childrenUnder10,
          childrenAbove10: consultation?.data?.childrenAbove10 ?? 0,
        })
      );
      let guestCountValue = `${consultation?.data?.adults ?? 1} người lớn`;
      if (consultation.data.childrenAbove10 > 0)
        guestCountValue += `, ${consultation.data.childrenAbove10} trẻ em từ 10 tuổi`;
      if (childrenUnder10 > 0)
        guestCountValue += `, ${childrenUnder10} trẻ em dưới 10 tuổi`;
      dispatch(updateBookingForm("guestCount", guestCountValue));
      // Map lại rooms từ ref sang object đầy đủ
      const selectedRoomsFromConsult = (
        consultation.data.selectedRooms ||
        consultation.data.consultationData?.requestedRooms ||
        []
      ).map((room) => {
        const detail =
          typeof room.roomId === "object" && room.roomId !== null
            ? room.roomId
            : rooms.find(
                (r) =>
                  (r._id?.toString?.() || r._id || r.id) ===
                  (room.roomId?.toString?.() || room.roomId || room.id)
              );
        return {
          id: detail?._id || room.roomId || room.id,
          name: detail?.name || room.roomName || room.name,
          price:
            detail?.price ??
            detail?.roomTypeId?.price ??
            room.roomPrice ??
            room.price,
          quantity: room.roomQuantity ?? room.quantity,
          description:
            detail?.description || room.roomDescription || room.description,
          area: detail?.area || room.roomArea,
          avatar: detail?.avatar || room.roomAvatar,
          max_people: detail?.max_people || room.roomMaxPeople,
          images:
            detail?.images ||
            (room.roomImage ? [room.roomImage] : room.images || []),
        };
      });
      if (onUpdateSelectedRooms) {
        onUpdateSelectedRooms(selectedRoomsFromConsult);
      }
      // Map lại services từ ref sang object đầy đủ
      const selectedServicesFromConsult = (
        consultation.data.selectedServices ||
        consultation.data.services ||
        consultation.data.consultationData?.requestServices ||
        []
      ).map((sv) => {
        const detail = services.find(
          (s) =>
            (s._id?.toString?.() || s._id || s.id) ===
            (sv.serviceId?.toString?.() || sv.serviceId || sv._id || sv.id)
        );
        return {
          serviceId: sv.serviceId || sv._id || sv.id,
          serviceName: detail?.serviceName || sv.serviceName || sv.serviceName,
          price: detail?.price ?? sv.servicePrice ?? sv.price,
          quantity: sv.serviceQuantity ?? sv.quantity,
          _id: sv._id || sv.serviceId || sv.id,
        };
      });
      dispatch(setSelectedYachtServices(selectedServicesFromConsult));
      setShowConsultationModal(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không tìm thấy dữ liệu yêu cầu tư vấn.",
      });
    }
  };

  const handleCancelConsultation = () => {
    if (consultation?.data?.bookingId) {
      Swal.fire({
        title: "Bạn có chắc muốn hủy yêu cầu tư vấn?",
        text: "Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Đúng, hủy nó!",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await dispatch(
            cancelConsultationRequestById(consultation.data.bookingId)
          );
          dispatch(resetBookingForm());
          dispatch(clearAllErrors());
          dispatch(setEditingBookingId(null));
          const today = new Date();
          const formatted = today.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          dispatch(updateBookingForm("checkInDate", formatted));
          setShowConsultationModal(false);
          if (yachtData?._id) {
            dispatch(fetchConsultationRequest(yachtData._id));
          }
        }
      });
    }
  };

  const handleSelectYachtServices = (services) => {
    dispatch(setSelectedYachtServices(services));
    setShowServiceModal(false);
  };

  useEffect(() => {
    if (show) {
      if (!editingBookingId) {
      }
      if (yachtData?._id) {
        dispatch(fetchConsultationRequest(yachtData._id));
      }
    }
  }, [show, editingBookingId, yachtData, dispatch]);

  const handleCloseModal = (e) => {
    // Chỉ preventDefault nếu có event và không phải là click vào backdrop
    if (e && e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Gọi onClose prop nếu có, nếu không thì dispatch action
    if (onClose) {
      onClose();
    } else {
      dispatch(closeBookingModal());
    }
  };

  if (!show) return null;

  // Thêm hàm tính tổng sức chứa các phòng đã chọn
  const getMaxPeopleForSelectedRooms = () => {
    return (selectedRooms || []).reduce((total, room) => {
      return total + (room.max_people || 0) * (room.quantity || 0);
    }, 0);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          fontFamily: "Archivo, sans-serif",
          mt: 7,
        }}
        onClick={handleCloseModal}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: (theme) => theme.shape.borderRadius / 5,
            maxWidth: "56rem",
            width: "100%",
            mx: 2,
            maxHeight: "80vh",
            p: 2,
            overflowY: "auto",
            boxShadow: (theme) => theme.shadows[1],
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              position: "relative",
            }}
          >
            <Typography
              fontFamily={"Archivo, sans-serif"}
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mx: "auto" }}
            >
              {editingBookingId ? "Chỉnh sửa yêu cầu" : "Đặt phòng"}
            </Typography>
            <Button
              onClick={handleCloseModal}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
                minWidth: 0,
              }}
            >
              <X size={24} />
            </Button>
          </Box>
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}> 
                <div
                  style={{
                    width: "100%",
                    position: "relative",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ position: "relative", marginBottom: 4 }}>
                    <Typography
                      sx={{
                        color: bookingErrors.checkInDate
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 1,
                        padding: "0 4px",
                        fontWeight: 600,
                        fontFamily: "Archivo, sans-serif",
                        zIndex: 2,
                        transition: "color 0.2s",
                        boxShadow: theme.shadows[1],
                        position: "absolute",
                        top: -16,
                        left: 15,
                        fontSize: 13,
                      }}
                    >
                      Ngày khởi hành
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: `2px solid ${
                          bookingErrors.checkInDate
                            ? theme.palette.error.main
                            : theme.palette.primary.main
                        }`,
                        borderRadius: 24,
                        padding: "10px 16px",
                        background: theme.palette.background.paper,
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 16,
                        color: theme.palette.text.primary,
                        boxShadow: bookingErrors.checkInDate
                          ? `0 0 0 2px ${theme.palette.error.light}`
                          : theme.shadows[1],
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        width: "100%",
                        outline: "none",
                        position: "relative",
                        cursor: "not-allowed",
                      }}
                    >
                      <CalendarIcon
                        size={20}
                        style={{
                          marginRight: 10,
                          color: bookingErrors.checkInDate
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {selectedScheduleObj?.startDate
                          ? new Date(
                              selectedScheduleObj.startDate
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : selectedScheduleObj?.scheduleId?.startDate
                          ? new Date(
                              selectedScheduleObj.scheduleId.startDate
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Không có lịch trình"}
                      </span>
                    </Box>
                  </div>
                  {bookingErrors.checkInDate && (
                    <div
                      style={{
                        color: theme.palette.error.main,
                        fontSize: 12,
                        marginTop: 2,
                        fontFamily: "Archivo, sans-serif",
                      }}
                    >
                      {bookingErrors.checkInDate}
                    </div>
                  )}
                </div>
                <GuestCounter
                  maxPeople={getMaxPeopleForSelectedRooms()}
                  minAdults={selectedRooms.length}
                />
              </Box>
              {/* Hiển thị chi tiết phòng và dịch vụ */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  borderRadius: 2,
                  boxShadow: (theme) => theme.shadows[1],
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    maxHeight: "150px",
                    overflowY: "scroll",
                    scrollbarGutter: "stable",
                    p: 1,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.background.paper,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: (theme) => theme.shadows[1],
                    color: (theme) => theme.palette.text.primary,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      borderRadius: "4px",
                      backgroundColor: "#f0f0f0",
                      display: "block",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0, 0, 0, 0.25)",
                      borderRadius: "4px",
                      minHeight: "20px",
                    },

                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", mx: 1, color: "primary.main" }}
                  >
                    Phòng đã chọn
                  </Typography>{" "}
                  {(selectedRooms || []).map((room) => (
                    <Box key={room.id} sx={{ mx: 2 }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: "text.primary",
                          fontFamily: "Archivo, sans-serif",
                        }}
                      >
                        <li>
                          {" "}
                          {room.name} x {room.quantity}:{" "}
                          {typeof room.price === "number"
                            ? room.price.toLocaleString()
                            : "0"}
                          đ/phòng
                        </li>
                      </Typography>
                    </Box>
                  ))}
                  {/* Hiển thị dịch vụ đã chọn cho booking */}
                  {selectedYachtServices &&
                    selectedYachtServices.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          mt: 2,
                          p: 1,
                          bgcolor: "background.default",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "secondary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          🎯 Dịch vụ đã chọn ({selectedYachtServices.length})
                        </Typography>
                        {selectedYachtServices.map((sv, idx) => (
                          <Box
                            key={sv.serviceId || idx}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                              p: 1,
                              bgcolor: "background.paper",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Box
                              sx={{
                                color: "secondary.main",
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <Edit size={16} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "0.875rem",
                                  color: "text.primary",
                                }}
                              >
                                {sv.serviceName}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  color: "text.secondary",
                                  mt: 0.5,
                                }}
                              >
                                {sv.price?.toLocaleString()}đ x{" "}
                                {sv.quantity || 1} khách ={" "}
                                {(
                                  sv.price * (sv.quantity || 1)
                                )?.toLocaleString()}
                                đ
                              </Typography>
                              {sv.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", mt: 0.5 }}
                                >
                                  {sv.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  {/* Nút chỉnh sửa dịch vụ */}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit size={16} />}
                    onClick={() => setShowServiceModal(true)}
                    sx={{
                      mt: 1,
                      borderRadius: 2,
                      width: "fit-content",
                      fontSize: "0.75rem",
                      textTransform: "none",
                      borderColor: "secondary.main",
                      color: "secondary.main",
                      "&:hover": {
                        borderColor: "secondary.dark",
                        color: "secondary.dark",
                        bgcolor: "secondary.light",
                      },
                    }}
                  >
                    {selectedYachtServices && selectedYachtServices.length > 0
                      ? "Chỉnh sửa dịch vụ"
                      : "Chọn dịch vụ"}
                  </Button>
                </Box>
                <Box
                  sx={{
                    pt: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    px: 3,
                    py: 2,
                    boxShadow: (theme) => theme.shadows[1],
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: "primary.contrastText",
                        fontFamily: "Archivo, sans-serif",
                      }}
                    >
                      Tổng tiền phòng:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        fontFamily: "Archivo, sans-serif",
                      }}
                    >
                      {totalRoomPrice.toLocaleString()} đ
                    </Typography>
                  </Box>
                  {selectedYachtServices &&
                    selectedYachtServices.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: "primary.contrastText",
                            fontFamily: "Archivo, sans-serif",
                          }}
                        >
                          Tổng tiền dịch vụ:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: "primary.contrastText",
                            fontWeight: "bold",
                            fontFamily: "Archivo, sans-serif",
                          }}
                        >
                          {totalServicePrice.toLocaleString()} đ
                        </Typography>
                      </Box>
                    )}
                </Box>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Họ và tên"
              value={bookingForm.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              error={!!bookingErrors.fullName}
              helperText={bookingErrors.fullName}
              required
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={bookingForm.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              error={!!bookingErrors.phoneNumber}
              helperText={bookingErrors.phoneNumber}
              required
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Địa chỉ email"
              type="email"
              value={bookingForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!bookingErrors.email}
              helperText={bookingErrors.email}
              required
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Yêu cầu của bạn"
              placeholder="Nhập yêu cầu của bạn"
              multiline
              rows={4}
              value={bookingForm.requirements}
              onChange={(e) =>
                handleInputChange("requirements", e.target.value)
              }
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                  fontFamily: "Archivo, sans-serif",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius / 5,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 2,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box
                sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  fontFamily={"Archivo, sans-serif"}
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Tổng tiền
                </Typography>
                <Typography
                  fontFamily={"Archivo, sans-serif"}
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {(totalRoomPrice + totalServicePrice).toLocaleString()} đ
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {editingBookingId ? (
                  <Button
                    onClick={() => handleSubmit("consultation_requested")}
                    disabled={submitting}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      textTransform: "none",
                      borderColor: "#f59e0b",
                      color: "#f59e0b",
                      "&:hover": {
                        borderColor: "#d97706",
                        color: "#d97706",
                        bgcolor: "background.default",
                      },
                    }}
                  >
                    {submitting ? "Đang cập nhật..." : "Cập nhật yêu cầu"}
                  </Button>
                ) : hasConsultation ? (
                  <Button
                    onClick={() => setShowConsultationModal(true)}
                    disabled={submitting}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.primary",
                      fontFamily: "Archivo, sans-serif",
                      "&:hover": { bgcolor: "background.default" },
                    }}
                  >
                    Xem yêu cầu đã gửi
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmit("consultation_requested")}
                    disabled={submitting}
                    style={{height: "50px"}}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.primary",
                      fontFamily: "Archivo, sans-serif",
                      "&:hover": { bgcolor: "background.default" },
                    }}
                  >
                    {submitting ? "Đang xử lý..." : "Đăng ký tư vấn"}
                  </Button>
                )}
                <Button
                  onClick={handleBookingButtonClick}
                  disabled={submitting}
                  variant="contained"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: (theme) => theme.shape.borderRadius / 2,
                    textTransform: "none",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontFamily: "Archivo, sans-serif",
                    "&:hover": { bgcolor: "primary.dark" },
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {submitting ? "Đang xử lý..." : getBookingButtonText()}
                  <ArrowRight />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ConsultationDetailsModal
        open={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        consultation={consultation?.data}
        onEdit={handleEditConsultation}
        onCancel={handleCancelConsultation}
        rooms={rooms}
        services={services}
      />
      <RoomServicesModal
        show={showServiceModal}
        yachtId={yachtData._id}
        onClose={() => setShowServiceModal(false)}
        onSelectServices={handleSelectYachtServices}
        selectedServices={selectedYachtServices}
        guestCount={adults + Math.floor(childrenAbove10 / 2)}
        key={adults + Math.floor(childrenAbove10 / 2)}
      />
    </>
  );
};

export default BookingRoomModal;