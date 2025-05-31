import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews }) => {
  // Kiểm tra xem reviews có phải là array không
  if (!Array.isArray(reviews)) {
    return <div>Lỗi: Dữ liệu đánh giá không hợp lệ</div>;
  }

  return (
    <div className="">
      {reviews.length > 0 ? (
        reviews.map((review, index) => {
          return (
            <ReviewItem
              key={review.id || review._id || index}
              review={review}
            />
          );
        })
      ) : (
        <div>Không có đánh giá nào.</div>
      )}
    </div>
  );
};

export default ReviewList;
