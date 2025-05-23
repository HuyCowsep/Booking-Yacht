// components/StarRating.jsx
import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, size = "sm", onClick = null }) => {
  const stars = Array(5).fill(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {stars.map((_, index) => {
        const ratingValue = index + 1;
        return (
          <div
            key={index}
            className={`cursor-${onClick ? "pointer" : "default"}`}
            onClick={() => onClick && onClick(ratingValue)}
            onMouseEnter={() => onClick && setHover(ratingValue)}
            onMouseLeave={() => onClick && setHover(0)}
          >
            <Star
              fill={(hover || rating) >= ratingValue ? "#FFA500" : "none"}
              color={(hover || rating) >= ratingValue ? "#FFA500" : "#FFA500"}
              size={size === "sm" ? 16 : size === "md" ? 20 : 24}
              className={size === "sm" ? "mr-0.5" : "mr-1"}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;