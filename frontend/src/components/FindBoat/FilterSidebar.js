import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DinnerDining from "@mui/icons-material/DinnerDining";
import Kayaking from "@mui/icons-material/Kayaking";
import Pool from "@mui/icons-material/Pool";
import Spa from "@mui/icons-material/Spa";
import StarIcon from "@mui/icons-material/Star";
import WineBar from "@mui/icons-material/WineBar";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setSelectedDurations,
  setSelectedServices,
  setSelectedStars,
} from "../../redux/actions";

const FilterSidebar = ({
  availableServices,
  availableDurations,
  serviceShowCount,
  setServiceShowCount,
  setCurrentPage,
  onClearFilters,
}) => {
  const dispatch = useDispatch();
  const { selectedStars, selectedDurations, selectedServices } = useSelector(
    (state) => state.filters || {}
  );
  const [showAllServices, setShowAllServices] = useState(false);

  const handleStarChange = (star) => {
    const newStars = selectedStars.includes(star)
      ? selectedStars.filter((s) => s !== star)
      : [...selectedStars, star];
    dispatch(setSelectedStars(newStars));
    setCurrentPage(1);
  };

  const handleDurationChange = (duration) => {
    const newDurations = selectedDurations.includes(duration)
      ? selectedDurations.filter((d) => d !== duration)
      : [...selectedDurations, duration];
    dispatch(setSelectedDurations(newDurations));
    setCurrentPage(1);
  };

  const handleServiceChange = (service) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    dispatch(setSelectedServices(newServices));
    setCurrentPage(1);
  };

  const handleShowMoreServices = () => {
    setShowAllServices(true);
    setServiceShowCount(availableServices.length);
  };

  const handleShowLessServices = () => {
    setShowAllServices(false);
    setServiceShowCount(5);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
        bgcolor: (theme) => theme.palette.background.paper,
        boxShadow: (theme) => theme.shadows[1],
      }}
    >
      {/* Tiêu đề và nút xóa bộ lọc */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          fontFamily: (theme) => theme.typography.fontFamily,
        }}
      >
        <Typography
          fontFamily={"Archivo, sans-serif"}
          variant="h6"
          fontWeight="bold"
        >
          Bộ lọc
        </Typography>
        <Button
          onClick={onClearFilters}
          variant="outlined"
          color="secondary"
          sx={{
            fontFamily: "Archivo, sans-serif",
            mb: 1,
            borderRadius: "20px",
          }}
        >
          Xóa bộ lọc
        </Button>
      </Box>

      {/* Đánh giá sao */}
      <Box sx={{ mb: 2 }}>
        <Typography
          fontFamily={"Archivo, sans-serif"}
          variant="subtitle1"
          fontWeight="medium"
        >
          Đánh giá sao
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Stack>
          {[5, 4, 3, 2, 1].map((star) => (
            <FormControlLabel
              key={star}
              control={
                <Checkbox
                  checked={selectedStars.includes(star)}
                  onChange={() => handleStarChange(star)}
                />
              }
              label={
                <span
                  style={{
                    display: "flex",
                    fontFamily: "Archivo, sans-serif",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {`${star} sao`}
                  <StarIcon
                    sx={{
                      fontSize: "1rem",
                      color: "#FFD700",
                    }}
                  />
                </span>
              }
            />
          ))}
        </Stack>
      </Box>

      {/* Thời gian chuyến đi */}
      <Box sx={{ mb: 2 }}>
        <Typography
          fontFamily={"Archivo, sans-serif"}
          variant="subtitle1"
          fontWeight="medium"
        >
          Lịch trình{" "}
          <CalendarTodayIcon
            sx={{
              fontSize: "1rem",
              color: "text.secondary",
              fontFamily: "Archivo, sans-serif",
            }}
          />
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Stack sx={{ fontFamily: "Archivo, sans-serif" }}>
          {availableDurations.map((duration) => (
            <FormControlLabel
              key={duration}
              control={
                <Checkbox
                  checked={selectedDurations.includes(duration)}
                  onChange={() => handleDurationChange(duration)}
                />
              }
              label={duration}
            />
          ))}
        </Stack>
      </Box>

      {/* Dịch vụ */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          fontFamily={"Archivo, sans-serif"}
          fontWeight="medium"
        >
          Dịch vụ{" "}
          <Chip
            label={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  marginLeft: -4,
                  fontFamily: "Archivo, sans-serif",
                }}
              >
                <Spa sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <DinnerDining
                  sx={{ fontSize: "1rem", color: "text.secondary" }}
                />
                <Kayaking sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <Pool sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <WineBar sx={{ fontSize: "1rem", color: "text.secondary" }} />
              </span>
            }
            sx={{
              fontFamily: "Archivo, sans-serif",
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#f0f7f7" : "#2f3b44",
              fontWeight: 500,
              opacity: 0.85,
            }}
          />
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Stack>
          {availableServices.slice(0, serviceShowCount).map((service) => (
            <FormControlLabel
              key={service}
              sx={{ fontFamily: "Archivo, sans-serif" }}
              control={
                <Checkbox
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceChange(service)}
                />
              }
              label={service}
            />
          ))}
          {availableServices.length > serviceShowCount && !showAllServices && (
            <Button
              variant="text"
              onClick={handleShowMoreServices}
              sx={{
                textTransform: "none",
                fontFamily: "Archivo, sans-serif",
                height: "35px",
                borderRadius: "32px",
                bgcolor: "primary.main",
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.primary.main),
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                mt: 1,
                fontSize: "0.875rem",
              }}
            >
              Xem thêm
            </Button>
          )}
          {showAllServices && (
            <Button
              variant="text"
              onClick={handleShowLessServices}
              sx={{
                textTransform: "none",
                fontFamily: "Archivo, sans-serif",
                height: "35px",
                borderRadius: "32px",
                mt: 1,
                fontSize: "1rem",
              }}
            >
              Thu gọn
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default FilterSidebar;
