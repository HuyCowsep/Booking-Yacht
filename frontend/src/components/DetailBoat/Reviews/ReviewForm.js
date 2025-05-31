import { useSelector, useDispatch } from "react-redux";
import { Send } from "lucide-react";
import Swal from "sweetalert2";
import StarRating from "./StarRating";
import { Box, TextField, Grid, Button, Typography, Stack, CircularProgress, useTheme } from "@mui/material";
import { setUserRating, setReviewDescription } from "../../../redux/action";
import { submitReview } from "../../../redux/asyncActions";

const ReviewForm = ({ yachtId, onSubmitSuccess }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { userRating, description, isSubmitting, error } = useSelector((state) => state.reviewForm);
  const customer = useSelector((state) => state.auth.customer);

  const getCustomerFromStorage = () => {
    try {
      const customerData = localStorage.getItem("customer");
      if (customerData) {
        const parsed = JSON.parse(customerData);
        return parsed;
      }
    } catch (error) {
      console.error("Error getting customer from storage:", error);
    }
    return null;
  };

  const currentCustomer = customer || getCustomerFromStorage();
  const fullName = currentCustomer?.fullName || "";
  const customerId = currentCustomer?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      Swal.fire({
        title: "Ủa? Khách đâu rồi?",
        text: "Không tìm thấy thông tin khách hàng.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!userRating || userRating < 1 || userRating > 5) {
      Swal.fire({
        title: "Chọn sao lẹ đi chớ 😤",
        text: "Chọn số sao từ 1-5 nha.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!description || !description.trim()) {
      Swal.fire({
        title: "Bạn không bình luận gì hả🥹",
        text: "Nhập nội dung đánh giá thôi nào.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!yachtId) {
      Swal.fire({
        title: "Ủa, du thuyền biến mất?",
        text: "Không tìm thấy thông tin du thuyền.",
        icon: "error",
        confirmButtonText: "OK",
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
          confirmButtonText: "OK",
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
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi gửi đánh giá.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Kiểm tra xem có thể đánh giá không
  if (!customerId) {
    return (
      <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 4, boxShadow: theme.shadows[1] }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Vui lòng đăng nhập để viết đánh giá.
        </Typography>

        {/* Debug info */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "action.hover",
            borderRadius: 2,
            fontSize: "12px",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Debug:
          </Typography>
          <Typography variant="body2">Customer: {customer ? "Redux có data" : "Redux null"}</Typography>
          <Typography variant="body2">LocalStorage: {getCustomerFromStorage() ? "Có data" : "Null"}</Typography>
          <Typography variant="body2">CustomerID: {customerId || "null"}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 4, bgcolor: "background.paper", borderRadius: 4, p: 4 }}>
      <Grid container spacing={3} sx={{ py: 2 }}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: 1,
              borderColor: "divider",
              borderRadius: "32px",
              bgcolor: "background.paper",
              boxShadow: theme.shadows[1],
              px: 3,
              py: 1.5,
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <Typography variant="body1" color="text.primary" sx={{ mr: 2 }}>
              Chất lượng:
            </Typography>
            <StarRating rating={userRating} size="lg" onClick={(rating) => dispatch(setUserRating(rating))} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Họ và tên *"
            value={fullName}
            disabled
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
                bgcolor: "background.paper",
                boxShadow: theme.shadows[1],
              },
              "& label.Mui-focused": { color: "primary.main" },
            }}
            helperText={
              <Typography variant="caption" color="text.secondary">
                Tên được lấy từ tài khoản của bạn
              </Typography>
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Đánh giá của bạn *"
          placeholder="Viết đánh giá của bạn về du thuyền này..."
          value={description}
          onChange={(e) => dispatch(setReviewDescription(e.target.value))}
          fullWidth
          multiline
          rows={5}
          error={description === "" || !!error}
          helperText={
            error ? (
              <Typography variant="caption" color="error.main">
                {error}
              </Typography>
            ) : description === "" ? (
              <Typography variant="caption" color="error.main">
                Vui lòng nhập nhận xét
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Bạn đang nhập đánh giá
              </Typography>
            )
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              "& fieldset": { borderColor: "divider" },
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
              bgcolor: "background.paper",
              boxShadow: theme.shadows[1],
            },
            "& label.Mui-focused": { color: "primary.main" },
          }}
        />
      </Box>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "32px",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "medium",
            px: 4,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <Send size={16} />}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ReviewForm;
