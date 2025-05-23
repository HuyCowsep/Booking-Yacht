import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, InputAdornment, Stack, Button, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PinDrop from "@mui/icons-material/PinDrop";
import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
import axios from "axios";
import { setSearchTerm, setDeparturePoint, setPriceRange } from "../../redux/action";

const SearchBar = ({ uniqueDeparturePoints, priceRanges, setCurrentPage }) => {
  const dispatch = useDispatch();
  const { searchTerm, selectedDeparturePoint, selectedPriceRange } = useSelector((state) => state.filters || {});
  const [searchOptions, setSearchOptions] = useState({
    cruise: ["Tất cả du thuyền"],
    location: ["Tất cả địa điểm"],
    price: ["Tất cả mức giá"],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const yachtsResponse = await axios.get("http://localhost:9999/api/v1/yachts", {
          params: { limit: 10, populate: "locationId" },
        });
        const yachtsData = Array.isArray(yachtsResponse.data?.data) ? yachtsResponse.data.data : [];

        const cruiseOptions = ["Tất cả du thuyền", ...new Set(yachtsData.map((y) => y.name))];
        const locationOptions = ["Tất cả địa điểm", ...new Set(yachtsData.map((y) => y.locationId?.name).filter(Boolean))];
        const priceOptions = ["Tất cả mức giá", "< 3 triệu", "3-6 triệu", "> 6 triệu"];

        setSearchOptions({ cruise: cruiseOptions, location: locationOptions, price: priceOptions });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tìm kiếm:", err);
      }
    };

    fetchOptions();
  }, []);

  const handleSearch = () => {
    dispatch(setSearchTerm(searchTerm || "Tất cả du thuyền"));
    dispatch(setDeparturePoint(selectedDeparturePoint || "Tất cả địa điểm"));
    dispatch(setPriceRange(selectedPriceRange || "Tất cả mức giá"));
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Nhập tên du thuyền"
          value={searchTerm || "Tất cả du thuyền"}
          onChange={(e) => dispatch(setSearchTerm(e.target.value || "Tất cả du thuyền"))}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{
            borderColor: (theme) => theme.palette.divider,
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px",
              color: "text.primary",
            },
          }}
        >
          {searchOptions.cruise.map((option) => (
            <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            value={selectedDeparturePoint || "Tất cả địa điểm"}
            onChange={(e) => dispatch(setDeparturePoint(e.target.value || "Tất cả địa điểm"))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDrop color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              borderColor: (theme) => theme.palette.divider,
              opacity: 0.8,
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                color: "text.primary",
              },
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
            value={selectedPriceRange || "Tất cả mức giá"}
            onChange={(e) => dispatch(setPriceRange(e.target.value || "Tất cả mức giá"))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonetizationOnOutlined color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              minWidth: 180,
              borderColor: (theme) => theme.palette.divider,
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px",
                color: "text.primary",
              },
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
            sx={{
              textTransform: "none",
              fontFamily: "Archivo, sans-serif",
              height: "48px",
              borderRadius: "32px",
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SearchBar;