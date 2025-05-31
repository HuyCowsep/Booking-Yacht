import { useSelector, useDispatch } from "react-redux";
import { Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Box, Input, useTheme, Button, Typography } from "@mui/material";
import { setReviewSearchTerm } from "../../../redux/action";
import { useEffect } from "react";
import { fetchCustomerIdFromStorage } from "../../../redux/asyncActions";

const ReviewHeader = ({ totalReviews, isAuthenticated, scrollToForm }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const searchTerm = useSelector((state) => state.reviews.searchTerm);
  const customer = useSelector((state) => state.auth.customer);

  const handleSearchChange = (e) => {
    dispatch(setReviewSearchTerm(e.target.value));
  };

  // Fallback lấy customer từ localStorage nếu Redux chưa có
  const getCustomerFromStorage = () => {
    try {
      const customerData = localStorage.getItem("customer");
      if (customerData) {
        const parsedCustomer = JSON.parse(customerData);
        return {
          accountId: parsedCustomer.accountId || parsedCustomer._id,
          customerId: parsedCustomer.id,
          fullName: parsedCustomer.fullName,
          username: parsedCustomer.username,
        };
      }
      return null;
    } catch (error) {
      console.error("Error retrieving customer from localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!customer) {
      dispatch(fetchCustomerIdFromStorage());
    }
  }, [dispatch, customer]);

  const currentCustomer = customer || getCustomerFromStorage();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
        Có ({totalReviews}) đánh giá
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Box position="relative">
          <Input
            type="text"
            placeholder="Tìm đánh giá"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              bgcolor: theme.palette.background.paper,
              pl: 5,
              pr: 2,
              py: 1,
              borderRadius: 999,
              fontSize: 14,
              boxShadow: 1,
            }}
          />
          <Box position="absolute" top="50%" left={14} sx={{ transform: "translateY(-50%)", color: "gray" }}>
            <Search size={20} />
          </Box>
        </Box>

        {isAuthenticated ? (
          <Button
            variant="contained"
            color="primary"
            onClick={scrollToForm}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.5,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: 14,
            }}
          >
            <Star fill="white" size={16} /> Gửi đánh giá
          </Button>
        ) : (
          <Link to="/login">
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                px: 2.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: 14,
              }}
            >
              <Star fill="gray" size={16} /> Đăng nhập để gửi đánh giá
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default ReviewHeader;
