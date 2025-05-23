// components/ReviewList.jsx
import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews }) => {
  return (
    <div className="">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;