import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CruiseCard from "../components/FindBoat/CruiseCard";
import FilterSidebar from "../components/FindBoat/FilterSidebar";
import PaginationSection from "../components/FindBoat/PaginationSection";
import SearchBar from "../components/FindBoat/SearchBar";
import {
  setCurrentPage,
  setDeparturePoint,
  setPriceRange,
  setSearchTerm,
  setSelectedDurations,
  setSelectedServices,
  setSelectedStars,
  setSortOption,
} from "../redux/actions";

const priceRanges = [
  { label: "< 3 triệu", value: "under-3", min: 0, max: 3000000 },
  { label: "3-6 triệu", value: "3-6", min: 3000000, max: 6000000 },
  { label: "> 6 triệu", value: "over-6", min: 6000000, max: Infinity },
  { label: "Tất cả mức giá", value: "all", min: 0, max: Infinity },
];

const sortOptions = [
  { label: "Không sắp xếp", value: "" },
  { label: "Giá: Thấp đến cao", value: "low-to-high" },
  { label: "Giá: Cao đến thấp", value: "high-to-low" },
];

const FindBoat = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    selectedDeparturePoint,
    selectedPriceRange,
    currentPage,
    selectedStars,
    selectedDurations,
    selectedServices,
    sortOption,
  } = useSelector((state) => state.filters || {});
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueDeparturePoints, setUniqueDeparturePoints] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableDurations, setAvailableDurations] = useState([]);
  const [serviceShowCount, setServiceShowCount] = useState(5);

  const itemsPerPage = 5;

  // Đọc query params khi load trang
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchTermParam = params.get("searchTerm");
    const departurePointParam = params.get("departurePoint");
    const priceRangeParam = params.get("priceRange");

    if (searchTermParam && searchTermParam !== searchTerm) {
      dispatch(setSearchTerm(searchTermParam));
    }
    if (departurePointParam && departurePointParam !== selectedDeparturePoint) {
      dispatch(setDeparturePoint(departurePointParam));
    }
    if (priceRangeParam && priceRangeParam !== selectedPriceRange) {
      dispatch(setPriceRange(priceRangeParam));
    }
    if (searchTermParam || departurePointParam || priceRangeParam) {
      dispatch(setCurrentPage(1));
    }
  }, [dispatch, searchTerm, selectedDeparturePoint, selectedPriceRange]);

  useEffect(() => {
    const fetchYachts = async () => {
      try {
        setLoading(true);

        // Lấy danh sách du thuyền
        const response = await axios.get("http://localhost:9999/api/v1/yachts/findboat");
        const initialYachts = Array.isArray(response.data?.data) ? response.data.data : [];

        // Lấy danh sách dịch vụ
        const servicesResponse = await axios.get("http://localhost:9999/api/v1/yachts/services");
        const servicesData = Array.isArray(servicesResponse.data?.data) ? servicesResponse.data.data : [];

        // Bổ sung starRating, durations, services cho từng du thuyền
        const yachtsWithDetails = await Promise.all(
          initialYachts.map(async (yacht) => {
            // Lấy feedbacks để tính starRating
            const feedbacksResponse = await axios.get(`http://localhost:9999/api/v1/yachts/${yacht._id}/feedbacks`);
            const feedbacks = feedbacksResponse.data?.data || [];
            const starRating =
              feedbacks.length > 0
                ? Math.round((feedbacks.reduce((sum, fb) => sum + (fb.starRating || 0), 0) / feedbacks.length) * 10) /
                  10
                : 0;

            // Lấy schedules để tính durations
            const schedulesResponse = await axios.get(`http://localhost:9999/api/v1/yachts/${yacht._id}/schedules`);
            const schedules = schedulesResponse.data?.data || [];
            const durations = schedules
              .filter((schedule) => schedule.scheduleId)
              .map((schedule) => {
                const startDate = new Date(schedule.scheduleId.startDate);
                const endDate = new Date(schedule.scheduleId.endDate);
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                return `${days} ngày ${days - 1} đêm`;
              });

            // Lấy services từ servicesData
            const services = servicesData
              .filter((service) => service.yachtId?.name === yacht.name)
              .map((service) => service.serviceId?.serviceName)
              .filter(Boolean);

            return { ...yacht, starRating, durations, services };
          })
        );

        setYachts(yachtsWithDetails);

        // Cập nhật uniqueDeparturePoints
        const points = [...new Set(yachtsWithDetails.map((yacht) => yacht.locationId?.name).filter(Boolean))];
        setUniqueDeparturePoints(points);

        // Cập nhật availableServices
        const services = [...new Set(servicesData.map((service) => service.serviceId?.serviceName).filter(Boolean))];
        setAvailableServices(services);

        // Cập nhật availableDurations
        const durations = [...new Set(yachtsWithDetails.flatMap((yacht) => yacht.durations).filter(Boolean))];
        setAvailableDurations(durations);

        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách du thuyền:", err);
        setError("Không thể tải danh sách du thuyền. Vui lòng thử lại sau.");
        setYachts([]);
        setUniqueDeparturePoints([]);
        setAvailableServices([]);
        setAvailableDurations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYachts();
  }, []);

  // Frontend filtering logic
  const filteredYachts = yachts.filter((yacht) => {
    // Filter by search term (name)
    const matchesSearchTerm =
      !searchTerm || searchTerm === "Tất cả du thuyền" || yacht.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by departure point (locationId.name)
    const matchesDeparturePoint =
      !selectedDeparturePoint ||
      selectedDeparturePoint === "Tất cả địa điểm" ||
      yacht.locationId?.name === selectedDeparturePoint;

    // Filter by price range (cheapestPrice)
    const cheapestPrice = yacht.cheapestPrice || 0;
    const matchesPriceRange = (() => {
      if (!selectedPriceRange || selectedPriceRange === "Tất cả mức giá") return true;
      if (selectedPriceRange === "< 3 triệu") return cheapestPrice >= 0 && cheapestPrice <= 3000000;
      if (selectedPriceRange === "3-6 triệu") return cheapestPrice >= 3000000 && cheapestPrice <= 6000000;
      if (selectedPriceRange === "> 6 triệu") return cheapestPrice > 6000000;
      return true;
    })();

    // Filter by stars (starRating)
    const matchesStars = selectedStars.length === 0 || selectedStars.includes(Math.round(yacht.starRating));

    // Filter by durations
    const yachtDurations = yacht.durations || [];
    const matchesDurations =
      selectedDurations.length === 0 || selectedDurations.some((d) => yachtDurations.includes(d));

    // Filter by services
    const yachtServices = yacht.services || [];
    const matchesServices = selectedServices.length === 0 || selectedServices.every((s) => yachtServices.includes(s));

    return (
      matchesSearchTerm &&
      matchesDeparturePoint &&
      matchesPriceRange &&
      matchesStars &&
      matchesDurations &&
      matchesServices
    );
  });

  // Sorting logic
  let sortedYachts = [...filteredYachts];
  if (sortOption) {
    sortedYachts.sort((a, b) => {
      const priceA = a.cheapestPrice || 0;
      const priceB = b.cheapestPrice || 0;
      if (sortOption === "low-to-high") return priceA - priceB;
      if (sortOption === "high-to-low") return priceB - priceA;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(sortedYachts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentYachts = sortedYachts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset bộ lọc
  const handleClearFilters = () => {
    dispatch(setSearchTerm("Tất cả du thuyền"));
    dispatch(setDeparturePoint("Tất cả địa điểm"));
    dispatch(setPriceRange("Tất cả mức giá"));
    dispatch(setSelectedStars([]));
    dispatch(setSelectedDurations([]));
    dispatch(setSelectedServices([]));
    dispatch(setCurrentPage(1));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* SearchBar */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "32px",
          border: "1px solid",
          fontFamily: (theme) => theme.typography.fontFamily,
          borderColor: (theme) => theme.palette.divider,
          bgcolor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{
            my: 3,
            fontFamily: "Archivo, sans-serif",
            color: "text.primary",
          }}
        >
          Bạn lựa chọn du thuyền Hạ Long nào?
        </Typography>
        <Typography
          align="center"
          color="text.primary"
          sx={{ mb: 2, fontFamily: "Archivo, sans-serif", opacity: 0.6 }}
        >
          Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
        </Typography>
        <SearchBar
          uniqueDeparturePoints={uniqueDeparturePoints}
          priceRanges={priceRanges}
          setCurrentPage={(page) => dispatch(setCurrentPage(page))}
        />
      </Paper>

      {/* Results count and sort */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 10,
          fontFamily: (theme) => theme.typography.fontFamily,
        }}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            bgcolor: theme.palette.background.paper,
            borderRadius: 32,
            p: theme.spacing(0.625, 2.5),
          })}
        >
          <Typography
            variant="h4"
            sx={{
              color: "text.primary",
              fontWeight: "bold",
            }}
            fontFamily={"Archivo, sans-serif"}
          >
            Tìm thấy {sortedYachts.length} kết quả
          </Typography>
          <Box
            sx={{
              width: "48px",
              height: "2px",
              backgroundColor: "primary.main",
              ml: "4px",
            }}
          />
        </Box>

        <TextField
          select
          value={sortOption}
          onChange={(e) => dispatch(setSortOption(e.target.value))}
          SelectProps={{ displayEmpty: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAltOutlined color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={(theme) => ({
            minWidth: 180,
            bgcolor: theme.palette.background.paper,
            borderRadius: 32,
            "& .MuiOutlinedInput-root": {
              borderRadius: 32,
              height: 50,
              fontFamily: theme.typography.fontFamily,
              fontWeight: 500,
              border: 0,
            },
          })}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* FilterSidebar */}
        <Grid item xs={12} md={3}>
          <FilterSidebar
            availableServices={availableServices}
            availableDurations={availableDurations}
            serviceShowCount={serviceShowCount}
            setServiceShowCount={setServiceShowCount}
            setCurrentPage={(page) => dispatch(setCurrentPage(page))}
            onClearFilters={handleClearFilters}
          />
        </Grid>

        {/* Cruise cards và Phân trang */}
        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            {loading ? (
              <Stack alignItems="center" spacing={1}>
                <CircularProgress size={28} color="primary" />
                <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
              </Stack>
            ) : error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : currentYachts.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="300px"
                textAlign="center"
                sx={{
                  backgroundColor: (theme) => theme.palette.background.paper,
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 4,
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="LongWave Logo"
                  style={{ width: 100, marginBottom: 16, opacity: 0.9 }}
                />
                <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                  𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 xin lỗi bạn 😢
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Không tìm thấy du thuyền nào phù hợp với tiêu chí tìm kiếm hiện tại.
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Thử thay đổi bộ lọc hoặc quay lại sau nha 💙
                </Typography>
              </Box>
            ) : (
              currentYachts.map((yacht) => <CruiseCard key={yacht._id} cruise={yacht} />)
            )}
          </Stack>

          {/* PaginationSection */}
          <PaginationSection
            totalPages={totalPages}
            filteredYachts={sortedYachts}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FindBoat;
