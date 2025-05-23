// components/ReviewForm.jsx
import { useState } from "react";
import { Send } from "lucide-react";
import StarRating from "./StarRating";
import InputField from "./InputField";
import { TextField } from "@mui/material";

const ReviewForm = () => {
  const [userRating, setUserRating] = useState(0);

  return (
    <div className="my-5">
      <div className="py-4 grid grid-cols-2 gap-4">
        <div
          className="flex border border-gray-200 p-2 items-center bg-slate-50"
          style={{ borderRadius: "32px" }}
        >
          <div className="mr-2">Chất lượng:</div>
          <StarRating rating={userRating} size="lg" onClick={setUserRating} />
        </div>

        <TextField
          label="Họ và tên *"
          placeholder="Nhập Họ và tên"
          focused
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
          helperText=" Bạn phải nhập Họ và tên "
        />
      </div>

      <div className="py-4 grid grid-cols-2 gap-4">
        <TextField
          label="Số điện thoại *"
          placeholder="Nhập số điện thoại"
          focused
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
          helperText=" Bạn pahir nhập số điện thoại"
        />
        <TextField
          label="Địa chỉ email *"
          placeholder="Nhập email"
          focused
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
          helperText=" Bạn phải nhập địa chỉ email"
        />
      </div>

      <div className="mb-4">
        <TextField
          focused
          label="Đánh giá của bạn *"
          placeholder="Nhập yêu cầu của bạn"
          className="w-full border border-gray-300 text-sm"
          multiline
          rows={5}
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
          helperText=" "
        />
      </div>

      <div className="flex justify-end">
        <button className="bg-[#77dada] text-black hover:bg-[#0e4f4f] hover:text-white px-6 rounded-3xl py-2 text-base font-semibold flex items-center">
          Gửi <Send size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;