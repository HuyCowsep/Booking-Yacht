import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import StarOutline from "@mui/icons-material/StarOutline";
import {
  Badge,
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Custom HotSaleBadge
const HotSaleBadge = ({ children, ...props }) => (
  <Badge {...props}>{children}</Badge>
);

// Custom ServiceChip
const ServiceChip = (props) => (
  <Chip
    {...props}
    sx={{
      fontFamily: "Archivo, sans-serif",
      bgcolor: (theme) =>
        theme.palette.mode === "light" ? "#f0f7f7" : "#2f3b44",
      fontWeight: 600,
      opacity: 0.8,
      ...props.sx,
    }}
  />
);

const CruiseCard = ({ cruise }) => {
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [firstImage, setFirstImage] = useState(null); // State for the first image
  const yachtId = cruise?._id;
  const { selectedDurations } = useSelector((state) => state.filters || {});

  // Fetch feedback data (ratings and reviews)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksResponse = await axios.get(
          `http://localhost:9999/api/v1/yachts/${yachtId}/feedbacks`
        );
        const feedbacks = Array.isArray(feedbacksResponse.data?.data)
          ? feedbacksResponse.data.data
          : [];
        const avg =
          feedbacks.length > 0
            ? (
                feedbacks.reduce((sum, fb) => sum + (fb.starRating || 0), 0) /
                feedbacks.length
              ).toFixed(1)
            : 0;
        setAvgRating(avg);
        setReviewCount(feedbacks.length);
      } catch (err) {
        console.error(
          `Lỗi khi lấy feedbacks cho yacht ${yachtId}:`,
          err.message
        );
      }
    };

    if (yachtId) {
      fetchFeedbacks();
    }
  }, [yachtId]);

  // Fetch the first image from YachtImage collection
  useEffect(() => {
    const fetchFirstImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/v1/yachtImages/yacht/${yachtId}`
        );
        const images = response.data.data || [];
        if (images.length > 0) {
          setFirstImage(images[0]); // Set the first image from the imageUrl array
        } else {
          setFirstImage(
            `https://via.placeholder.com/300x200?text=${encodeURIComponent(
              cruise.name
            )}`
          ); // Fallback placeholder image
        }
      } catch (err) {
        setFirstImage(
          `https://via.placeholder.com/300x200?text=${encodeURIComponent(
            cruise.name
          )}`
        ); // Fallback on error
      }
    };

    if (yachtId) {
      fetchFirstImage();
    }
  }, [yachtId, cruise.name]);

  // Defensive check for cruise prop
  if (!cruise || typeof cruise !== "object" || !cruise._id) {
    console.error("CruiseCard: Invalid or missing cruise prop", cruise);
    return null;
  }

  const {
    _id: id,
    name = "Unknown Cruise",
    launch,
    hullBody,
    maxRoom,
    services = [],
  } = cruise;

  return (
    <Link to={`/boat-detail/${yachtId}`} style={{ textDecoration: "none" }}>
      <Card
        key={id}
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "row" },
          borderRadius: "32px",
          width: "100%",
          alignItems: "center",
          cursor: "pointer",
          transition: "transform 0.2s",
          border: "1px solid",
          bgcolor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: "45%" },
            padding: "16px",
          }}
        >
          <CardMedia
            component="img"
            height={200}
            image={cruise.image} // Use the fetched first image
            alt={name}
            sx={{
              width: "352px",
              height: "264px",
              borderRadius: "32px",
              position: "relative",
              overflow: "hidden",
              objectFit: "cover",
              maxWidth: "100%",
              boxShadow: (theme) => theme.shadows[1],
            }}
          />
          <HotSaleBadge
            sx={{
              display: "flex",
              borderRadius: "16px",
              fontFamily: "Archivo, sans-serif",
              left: "28px",
              top: "28px",
              color: (theme) =>
                theme.palette.mode === "light" ? "#7a2e0e" : "#fedf89",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              padding: "2px 8px 2px 6px",
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#fedf89" : "#7a2e0e",
              gap: "4px",
            }}
          >
            <StarOutline
              sx={{
                fontSize: "16px",
                color: (theme) =>
                  theme.palette.mode === "light" ? "#f79009" : "#fedf89",
              }}
            />
            {avgRating} ({reviewCount}) đánh giá
          </HotSaleBadge>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            width: { xs: "100%", md: "55%" },
            justifyContent: "space-between",
            padding: "0 16px",
            gap: "20px",
          }}
        >
          {/* Upper section */}
          <Box sx={{ gap: "10px" }}>
            <Typography
              variant="subtitle2"
              color="primary"
              gutterBottom
              fontFamily="Archivo, sans-serif"
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "16px",
                width: "fit-content",
                padding: "5px 8px",
                marginBottom: "10px",
                boxShadow: (theme) => theme.shadows[1],
              }}
            >
              Du thuyền {name}
            </Typography>
            <Typography
              fontFamily="Archivo, sans-serif"
              sx={{
                fontSize: "25px",
                color: "text.primary",
                fontWeight: "700",
                lineHeight: "32px",
              }}
            >
              {name}
            </Typography>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DirectionsBoatIcon
                  sx={{
                    fontSize: "1rem",
                    mr: 0.5,
                    color: "text.secondary",
                  }}
                />
                <Typography
                  fontFamily="Archivo, sans-serif"
                  variant="body2"
                  color="text.secondary"
                >
                  Hạ thuỷ: {launch || "Không xác định"} - Thân vỏ:{" "}
                  {hullBody || "Không xác định"} -{maxRoom || "Không xác định"}{" "}
                  phòng
                </Typography>
              </Box>
            </Stack>
            {/* Services */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{
                fontWeight: 600,
                opacity: 0.8,
                fontFamily: "Archivo, sans-serif",
                lineHeight: "24px",
                gap: "5px 0",
              }}
            >
              {services.slice(0, 5).map((service, index) => (
                <ServiceChip key={index} label={service} size="small" />
              ))}
              {services.length > 5 && (
                <ServiceChip label={`+${services.length - 5}`} size="small" />
              )}
            </Stack>
          </Box>
          <Divider
            sx={{ my: 1, borderColor: (theme) => theme.palette.divider }}
          />
          {/* Bottom section */}
          <Box sx={{ justifyContent: "flex-end" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  lineHeight: "28px",
                  fontWeight: 700,
                  color: "primary.main",
                }}
                fontFamily="Archivo, sans-serif"
              >
                Liên hệ
              </Typography>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontFamily: "Archivo, sans-serif",
                  height: "35px",
                  borderRadius: "32px",
                  bgcolor: "primary.main",
                  color: (theme) =>
                    theme.palette.getContrastText(theme.palette.primary.main),
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Đặt ngay
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};

export default CruiseCard;
