import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Paper, Typography, Box, Button, Stack, TextField, MenuItem, useTheme } from "@mui/material";
import axios from "axios";
import { setSearchTerm, setDeparturePoint, setPriceRange, setCurrentPage } from "../../redux/action";

export default function Banner() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const backgroundImage = theme.palette.mode === "light" ? "/images/background.jpg" : "/images/background2.jpg";

  const [searchOptions, setSearchOptions] = useState({
    cruise: ["Tất cả du thuyền"],
    location: ["Tất cả địa điểm"],
    price: ["Tất cả mức giá"],
  });
  const [selectedCruise, setSelectedCruise] = useState("Tất cả du thuyền");
  const [selectedLocation, setSelectedLocation] = useState("Tất cả địa điểm");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả mức giá");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const yachtsResponse = await axios.get("http://localhost:9999/api/v1/yachts", {
          params: { limit: 10, populate: "locationId" },
        });
        const yachts = Array.isArray(yachtsResponse.data?.data) ? yachtsResponse.data.data : yachtsResponse.data || [];

        // Danh sách du thuyền
        const cruiseOptions = ["Tất cả du thuyền", ...new Set(yachts.map((y) => y.name))];

        // Danh sách địa điểm
        const locationOptions = ["Tất cả địa điểm", ...new Set(yachts.map((y) => y.locationId?.name).filter((n) => n))];

        // Danh sách giá (đồng bộ với SearchBar.js)
        const priceOptions = ["Tất cả mức giá", "< 3 triệu", "3-6 triệu", "> 6 triệu"];

        setSearchOptions({ cruise: cruiseOptions, location: locationOptions, price: priceOptions });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tìm kiếm:", err);
      }
    };

    fetchOptions();
  }, []);

  const handleSearch = () => {
    // Dispatch Redux actions
    dispatch(setSearchTerm(selectedCruise));
    dispatch(setDeparturePoint(selectedLocation));
    dispatch(setPriceRange(selectedPrice));
    dispatch(setCurrentPage(1));
    // Chuyển hướng đến /find-boat? (không kèm query params), giảm UX người dùng là chắc chắn:))
    window.location.href = "/find-boat";
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 750,
        position: "relative",
        background: `url(${backgroundImage}) center/cover no-repeat`,
        py: 10,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          py: { xs: 5, md: 5 },
          px: { xs: 1, md: 4 },
          borderRadius: 4,
          minWidth: { xs: "95%", md: 600 },
          maxWidth: 720,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          bottom: { xs: -48, md: -85 },
          left: 0,
          right: 0,
          bgcolor: (theme) => theme.palette.background.paper,
          border: "1px solid",
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <Typography variant="h6" fontWeight={700} align="center" sx={{ color: "primary.main" }}>
          Bạn lựa chọn du thuyền Hạ Long nào?
        </Typography>
        <Typography variant="body2" align="center" mb={2} sx={{ color: "text.secondary" }}>
          Hơn 100 tour du thuyền hạng sang, chất lượng tốt sẵn sàng cho bạn chọn
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
          <TextField
            select
            size="small"
            fullWidth
            value={selectedCruise}
            onChange={(e) => setSelectedCruise(e.target.value)}
            label="Loại du thuyền"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                bgcolor: (theme) => theme.palette.background.paper,
                "& fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.cruise.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            fullWidth
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            label="Địa điểm"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                bgcolor: (theme) => theme.palette.background.paper,
                "& fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.location.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            fullWidth
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            label="Mức giá"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                bgcolor: (theme) => theme.palette.background.paper,
                "& fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiSelect-icon": { color: "text.primary" },
            }}
          >
            {searchOptions.price.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              width: { xs: "100%", sm: "auto" },
              py: 1,
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              borderRadius: "32px",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}