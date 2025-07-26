import { Box } from "@mui/material";
import StarRating from "./StarRating";

const ReviewItem = ({ review }) => {
  // Kiểm tra xem review có tồn tại khô
  if (!review) {
    return <div>Không có dữ liệu đánh giá</div>;
  }

  return (
    <Box
      className="p-7 rounded-3xl shadow-lg mb-4"
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        borderColor: (theme) => theme.palette.divider,
        boxShadow: (theme) => theme.shadows[1],
        color: (theme) => theme.palette.text.primary,
        "&:hover": {
          boxShadow: (theme) => theme.shadows[3],
        },
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="flex items-center mb-2">
        <StarRating rating={review.rating || 0} />
      </div>
      <div className="font-medium my-3">
        {review.userName || "Khách ẩn danh"}
      </div>
      {review.tag && <div className="text-sm mb-1">{review.tag}</div>}
      <div className="text-sm my-3 mb-1">
        {review.comment || "Không có bình luận"}
      </div>
      <div className="text-xs">
        {review.date ||
          review.date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) ||
          "N/A"}
      </div>
    </Box>
  );
};

export default ReviewItem;
