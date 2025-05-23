// components/RatingBar.jsx
const RatingBar = ({ value, total, count }) => {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center my-1">
      <div className="w-12 text-base text-blue-700">{value} sao</div>
      <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
        <div
          className="bg-orange-400 h-2  rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className=" text-base line-clamp-1 text-blue-700 text-right">
        <p> {count} đánh giá</p>
      </div>
    </div>
  );
};

export default RatingBar;