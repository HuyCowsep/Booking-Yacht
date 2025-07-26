import { useSelector, useDispatch } from "react-redux";
import { Send } from "lucide-react";
import Swal from "sweetalert2";
import StarRating from "./StarRating";
import { Box, TextField } from "@mui/material";
import { setUserRating, setReviewDescription } from "../../../redux/actions";
import { validateReviewForm } from "../../../redux/validation";
import { submitReview } from "../../../redux/asyncActions";
import { Link } from "react-router-dom";

const ReviewForm = ({ yachtId, onSubmitSuccess }) => {
  const dispatch = useDispatch();
  const { userRating, description, isSubmitting, error } = useSelector((state) => state.reviewForm);
  const customer = useSelector((state) => state.account.account.customer); // Lấy từ state.account

  // Debug để kiểm tra dữ liệu customer
  console.log("Customer from Redux:", customer);

  // Lấy customerId từ _id (hoặc kiểm tra các trường khác như customerId nếu có)
  const fullName = customer?.fullName || "";
  const customerId = customer?._id || customer?.customerId || customer?.id; // Thử các trường có thể có

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy thông tin khách hàng.",
        icon: "error",
      });
      return;
    }

    if (!userRating || userRating < 1 || userRating > 5) {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng chọn số sao từ 1-5.",
        icon: "error",
      });
      return;
    }

    if (!description || !description.trim()) {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập nội dung đánh giá.",
        icon: "error",
      });
      return;
    }

    if (!yachtId) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy thông tin du thuyền.",
        icon: "error",
      });
      return;
    }

    const reviewData = {
      starRating: userRating,
      description: description.trim(),
      customerId,
      yachtId,
    };

    try {
      const result = await dispatch(submitReview(reviewData));

      if (result.success) {
        Swal.fire({
          title: "Thành công!",
          text: "Đánh giá của bạn đã được gửi.",
          icon: "success",
        });

        // Reset form
        dispatch(setUserRating(0));
        dispatch(setReviewDescription(""));

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: result.message || "Không thể gửi đánh giá.",
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi gửi đánh giá.",
        icon: "error",
      });
    }
  };

  // Kiểm tra xem có thể đánh giá không
  if (!customerId) {
    return (
      <div className="review-form-disabled">
        <p>
          Vui lòng{" "}
          <Link to="/login" className="text-teal-500 underline">
            đăng nhập
          </Link>{" "}
          để gửi đánh giá.
        </p>

        {/* Debug info */}
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <strong>Debug:</strong>
          <br />
          Customer: {customer ? "Redux có data" : "Redux null"}
          <br />
          CustomerID: {customerId || "null"}
          <br />
          Customer._id: {customer?._id || "null"}
          <br />
          Customer.customerId: {customer?.customerId || "null"}
          <br />
          Customer.id: {customer?.id || "null"}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="my-5">
      <div className="py-4 grid grid-cols-2 gap-4">
        <Box
          className="flex border px-3 items-center"
          sx={{
            "& .MuiBox-root": { borderRadius: "32px" },
            "& .MuiBox-root:hover": { borderColor: "#1976d2" },
            borderRadius: "32px",
            border: "1px solid",
            height: "56px",
            display: "flex",
            borderColor: (theme) => theme.palette.divider,
            bgcolor: (theme) => theme.palette.background.paper,
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          <div className="mr-2">Chất lượng:</div>
          <StarRating rating={userRating} size="lg" onClick={(rating) => dispatch(setUserRating(rating))} />
        </Box>
        <TextField
          label="Họ và tên *"
          value={fullName}
          disabled
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
              borderColor: (theme) => theme.palette.divider,
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[1],
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
          helperText="Tên được lấy từ tài khoản của bạn"
        />
      </div>
      <div className="mb-4">
        <TextField
          focused
          label="Đánh giá của bạn"
          placeholder="Nhập đánh giá của bạn"
          value={description}
          onChange={(e) => dispatch(setReviewDescription(e.target.value))}
          className="w-full text-sm"
          multiline
          rows={5}
          required
          error={description === "" || !!error}
          helperText={error ? error : description === "" ? "Vui lòng nhập nhận xét" : "Bạn phải nhập đánh giá"}
          sx={{
            borderRadius: "32px",
            "& label": { color: "#000" },
            "& label.Mui-focused": { color: "#1976d2" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              borderColor: (theme) => theme.palette.divider,
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[1],
            },
          }}
          InputProps={{
            style: { borderRadius: "32px" },
          }}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#77dada] text-gray-100 hover:bg-[#0e4f4f] hover:text-white px-6 rounded-3xl py-2 text-base font-semibold flex items-center"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"} <Send size={16} className="ml-2" />
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
