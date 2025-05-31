import { Box } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../redux/action";

function Tabs() {
  const dispatch = useDispatch({});
  const activeTab = useSelector((state) => state.ui.activeTab);
  const totalReviews = useSelector(
    (state) => state.reviews.ratingData?.total || 0
  );
  const tabs = [
    { label: "Đặc điểm", id: "features" },
    { label: "Phòng & giá", id: "rooms" },
    { label: "Giới thiệu", id: "introduction" },
    { label: "Quy định", id: "regulations" },
    { label: "Đánh giá", id: "reviews" },
  ];

  const handleTabClick = (index, id) => {
    dispatch(setActiveTab(index));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box
      className="shadow-md rounded-xl border-b flex overflow-x-auto py-2"
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        borderColor: (theme) => theme.palette.divider,
        boxShadow: (theme) => theme.shadows[1],
      }}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(index, tab.id)}
          className={`flex items-center px-2 py-1 text-sm mx-2 transition-all duration-200 ${
            activeTab === index
              ? "text-gray-700 bg-gray-50 border shadow-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border hover:shadow"
          }`}
        >
          <span>{tab.label}</span>
          {tab.label === "Đánh giá" && totalReviews > 0 && (
            <span className="ml-1 bg-gray-100 rounded-lg px-1 text-xs">
              ({totalReviews})
            </span>
          )}
        </button>
      ))}
    </Box>
  );
}

export default Tabs;
