// components/RatingOverview.jsx
import StarRating from "./StarRating";
import RatingBar from "./RatingBar";
import { Box } from "@mui/material";

const RatingOverview = ({ ratingData }) => {
  return (
    <Box
      className="bg-white  rounded-3xl border border-gray-200 p-4 mb-6"
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        borderColor: (theme) => theme.palette.divider,
        boxShadow: (theme) => theme.shadows[1],
      }}
    >
      <div className="flex">
        <div className="w-1/4 border-r border-gray-200 pr-6 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-orange-500">
            {ratingData.average}
          </div>
          <div className="mt-1 mb-2">
            <StarRating rating={Math.round(ratingData.average)} />
          </div>
        </div>
        <div className="w-3/4 pl-6">
          {ratingData.distribution
            .slice()
            .reverse()
            .map((item) => (
              <RatingBar
                key={item.stars}
                value={item.stars}
                total={ratingData.total}
                count={item.count}
              />
            ))}
        </div>
      </div>
    </Box>
  );
};

export default RatingOverview;
