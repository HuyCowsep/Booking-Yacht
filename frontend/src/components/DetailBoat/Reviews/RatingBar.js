// components/RatingBar.jsx
import { Box, Typography, useTheme } from "@mui/material";

const RatingBar = ({ value, total, count }) => {
  const theme = useTheme();
  const percent = total > 0 ? (count / total) * 100 : 0;

  // Tùy theo mode để chọn màu nền phù hợp
  const barBackgroundColor =
    theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[300];

  return (
    <Box display="flex" alignItems="center" fontWeight={500} my={1}>
      {/* Số sao */}
      <Typography
        variant="body2"
        sx={{ width: 60, color: theme.palette.primary.dark }}
      >
        {value} sao
      </Typography>

      {/* Thanh đánh giá */}
      <Box
        flex={1}
        height={8}
        borderRadius={theme.shape.borderRadius}
        mx={2}
        sx={{ backgroundColor: barBackgroundColor }}
      >
        <Box
          height="100%"
          borderRadius={theme.shape.borderRadius}
          sx={{ 
            width: `${percent}%`,
            backgroundColor: theme.palette.purple.main,
            transition: "width 0.3s ease-in-out",
          }}
        />
      </Box>

      {/* Số lượng đánh giá */}
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, minWidth: "80px", textAlign: "right" }}
      >
        {count} đánh giá
      </Typography>
    </Box>
  );
};

export default RatingBar;
