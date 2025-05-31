import { useSelector, useDispatch } from "react-redux";
import { Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Box, Input } from "@mui/material";
import { setReviewSearchTerm } from "../../../redux/action";
import { useEffect } from "react";
import { fetchCustomerIdFromStorage } from "../../../redux/asyncActions";

const ReviewHeader = ({ totalReviews, isAuthenticated }) => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.reviews.searchTerm);
  const customer = useSelector((state) => state.auth.customer);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setReviewSearchTerm(value));
  };

  // Function để lấy thông tin customer từ localStorage
  const getCustomerFromStorage = () => {
    try {
      const customerData = localStorage.getItem("customer");
      if (customerData) {
        const parsedCustomer = JSON.parse(customerData);
        return {
          accountId: parsedCustomer.accountId || parsedCustomer._id,
          customerId: parsedCustomer.id, // ID của customer để đánh giá
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
    // Dispatch để đảm bảo customer data được load vào Redux
    if (!customer) {
      dispatch(fetchCustomerIdFromStorage());
    }
  }, [dispatch, customer]);

  // Lấy customer info từ Redux hoặc fallback về localStorage
  const currentCustomer = customer || getCustomerFromStorage();

  return (
    <div className="flex items-center justify-between mb-4">
      <p className="font-bold light:text-gray-900 text-4xl">
        Đánh giá ({totalReviews})
      </p>
      <div className="flex items-center space-x-4">
        <div className="relative items-center">
          <Input
            type="text"
            placeholder="Tìm đánh giá"
            value={searchTerm}
            onChange={handleSearchChange}
            className="!pl-8 !pr-4 !py-2 !rounded-full !text-sm !w-56"
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
            }}
          />
          <div className="absolute left-3 top-[12px] text-gray-400">
            <Search size={20} />
          </div>
        </div>

        {isAuthenticated ? (
          <button className="bg-teal-500 hover:bg-[#0e4f4f] border-2 hover:border-teal-500 text-white px-4 py-2 rounded-full text-sm flex items-center">
            <Star fill="white" size={16} className="mr-1" /> Gửi đánh giá
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm flex items-center cursor-pointer"
          >
            <Star fill="gray" size={16} className="mr-1" /> Đăng nhập để gửi
            đánh giá
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReviewHeader;
