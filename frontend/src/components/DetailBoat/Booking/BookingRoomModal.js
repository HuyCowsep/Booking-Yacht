import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ArrowRight } from "lucide-react";
import { Box, TextField } from "@mui/material";
import GuestCounter from "./GuestCounter";
import Swal from "sweetalert2";
import {
  updateBookingForm,
  setBookingErrors,
  closeBookingModal,
} from "../../../redux/action";
import { validateBookingForm, formatPrice } from "../../../redux/validation";
import {
  submitRoomBooking,
  requestConsultation,
} from "../../../redux/asyncActions";

const BookingRoomModal = ({ show, yachtData }) => {
  const dispatch = useDispatch();
  const { bookingForm, bookingErrors, rooms, totalPrice } = useSelector(
    (state) => state.booking
  );

  const handleInputChange = (field, value) => {
    dispatch(updateBookingForm(field, value));
  };

  const handleConsultation = async () => {
    const validation = validateBookingForm(bookingForm);
    if (!validation.isValid) {
      dispatch(setBookingErrors(validation.errors));
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng kiểm tra lại thông tin nhập.",
        confirmButtonText: "OK",
      });
      return;
    }

    const consultationData = {
      ...bookingForm,
      checkInDate: new Date(
        bookingForm.checkInDate.split("/").reverse().join("-")
      ).toISOString(),
      selectedRooms: rooms.filter((r) => r.quantity > 0),
      totalPrice,
      yachtId: yachtData._id,
    };

    const result = await dispatch(requestConsultation(consultationData));
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Đăng ký tư vấn thành công!",
        text: "Chúng tôi sẽ liên hệ với bạn để tư vấn chi tiết về booking.",
        showConfirmButton: false,
        timer: 2000,
      });
      dispatch(closeBookingModal());
    }
  };

  const handleBookNow = async () => {
    const validation = validateBookingForm(bookingForm);
    if (!validation.isValid) {
      dispatch(setBookingErrors(validation.errors));
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng kiểm tra lại thông tin nhập.",
        confirmButtonText: "OK",
      });
      return;
    }

    const bookingData = {
      ...bookingForm,
      checkInDate: new Date(
        bookingForm.checkInDate.split("/").reverse().join("-")
      ).toISOString(),
      selectedRooms: rooms.filter((r) => r.quantity > 0),
      totalPrice,
      yachtId: yachtData._id,
    };

    const result = await dispatch(submitRoomBooking(bookingData));
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Đặt phòng thành công!",
        html: `
          <div>
            <p>Cảm ơn bạn đã đặt phòng du thuyền.</p>
            <p><strong>Tổng tiền: ${formatPrice(totalPrice)}</strong></p>
            <p>Chúng tôi sẽ xác nhận đặt chỗ trong vòng 24h.</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 3000,
      });
      dispatch(closeBookingModal());
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box
        className="rounded-3xl max-w-4xl mt-16 w-full mx-4 max-h-[80vh] p-5 overflow-y-auto"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-xl font-bold text-gray-800">Đặt phòng</h2>
          <button
            onClick={() => dispatch(closeBookingModal())}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              fullWidth
              label="Ngày nhận phòng"
              type="date"
              value={
                bookingForm.checkInDate
                  ? bookingForm.checkInDate.split("/").reverse().join("-")
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                const formatted = val
                  ? new Date(val).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "";
                handleInputChange("checkInDate", formatted);
              }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!bookingErrors.checkInDate}
              helperText={bookingErrors.checkInDate}
              sx={{
                fontFamily: "Archivo, sans-serif",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "32px",
                  fontFamily: "Archivo, sans-serif",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#14b8a6" },
                  "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  "&.Mui-focused": { color: "#14b8a6" },
                },
              }}
            />
            <GuestCounter />
          </div>
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#14b8a6" },
                "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": { color: "#14b8a6" },
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                fontFamily: "Archivo, sans-serif",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#14b8a6" },
                "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": { color: "#14b8a6" },
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                fontFamily: "Archivo, sans-serif",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#14b8a6" },
                "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": { color: "#14b8a6" },
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
            onChange={(e) => handleInputChange("requirements", e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                fontFamily: "Archivo, sans-serif",
                "& fieldset": { borderColor: "#d1d5db" },
                "&:hover fieldset": { borderColor: "#14b8a6" },
                "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
              },
              "& .MuiInputLabel-root": {
                color: "#374151",
                fontFamily: "Archivo, sans-serif",
                "&.Mui-focused": { color: "#14b8a6" },
              },
            }}
          />
          <div className="flex items-center pt-4 border-t">
            <div className="flex w-1/3 items-center">
              <span className="text-lg font-bold text-gray-800">Tổng tiền</span>
              <span className="ml-2 text-xl font-bold text-teal-600">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex w-2/3 justify-end space-x-3 pt-2">
              <button
                onClick={handleConsultation}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-3xl hover:bg-gray-50 font-medium transition-colors"
              >
                <p className="flex items-center mx-auto justify-center gap-2">
                  Đăng ký tư vấn
                </p>
              </button>
              <button
                onClick={handleBookNow}
                className="flex-1 py-3 px-4 bg-teal-400 text-white rounded-3xl hover:bg-teal-500 font-medium transition-colors"
              >
                <p className="flex items-center mx-auto justify-center gap-2">
                  Đặt ngay <ArrowRight />
                </p>
              </button>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default BookingRoomModal;
