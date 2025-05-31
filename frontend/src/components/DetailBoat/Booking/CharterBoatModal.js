import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ArrowRight } from "lucide-react";
import { Box, TextField } from "@mui/material";
import GuestCounter from "./GuestCounter";
import Swal from "sweetalert2";
import {
  updateCharterForm,
  setCharterErrors,
  requestConsultation,
  submitCharterBooking,
  closeCharterModal,
} from "../../../redux/action";
import { validateBookingForm } from "../../../redux/validation";

const CharterBoatModal = ({ show, yachtData }) => {
  const dispatch = useDispatch();
  const { charterForm, charterErrors } = useSelector((state) => state.booking);

  const handleInputChange = (field, value) => {
    dispatch(updateCharterForm(field, value));
  };

  const handleConsultation = () => {
    const validation = validateBookingForm(charterForm);
    dispatch(setCharterErrors(validation.errors));
    if (validation.isValid) {
      dispatch(requestConsultation(charterForm)).then((result) => {
        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Đăng ký tư vấn thành công!",
            text: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      });
    }
  };

  const handleBookNow = () => {
    const validation = validateBookingForm(charterForm);
    dispatch(setCharterErrors(validation.errors));
    if (validation.isValid) {
      dispatch(submitCharterBooking(charterForm)).then((result) => {
        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Đặt thuê trọn tàu thành công!",
            text: "Cảm ơn bạn đã đặt dịch vụ. Chúng tôi sẽ xác nhận đặt chỗ sớm nhất.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      });
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
          <h2 className="text-xl font-bold text-gray-800">Thuê trọn tàu</h2>
          <button
            onClick={() => dispatch(closeCharterModal())}
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
                charterForm.checkInDate
                  ? charterForm.checkInDate.split("/").reverse().join("-")
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                const formatted =
                  val && val.includes("-")
                    ? val.split("-").reverse().join("/")
                    : val;
                handleInputChange("checkInDate", formatted);
              }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
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
            value={charterForm.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            error={!!charterErrors.fullName}
            helperText={charterErrors.fullName}
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
            value={charterForm.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            error={!!charterErrors.phoneNumber}
            helperText={charterErrors.phoneNumber}
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
            value={charterForm.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!charterErrors.email}
            helperText={charterErrors.email}
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
            value={charterForm.requirements}
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
          <div className="flex justify-end space-x-3 pt-2">
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
      </Box>
    </div>
  );
};

export default CharterBoatModal;
