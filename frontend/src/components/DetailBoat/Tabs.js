import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../redux/action";

function Tabs() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.activeTab);
  const totalReviews = useSelector((state) => state.reviews.ratingData?.total || 0);
  const tabs = [
    { label: "Đặc điểm", id: "features" },
    { label: "Phòng & giá", id: "rooms" },
    { label: "Giới thiệu", id: "introduction" },
    { label: "Quy định", id: "regulations" },
    { label: "Hỏi đáp", id: "faq" },
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
      sx={{
        display: "flex",
        overflowX: "auto",
        py: 2,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        borderRadius: (theme) => theme.shape.borderRadius,
        boxShadow: (theme) => theme.shadows[1],
      }}
    >
      {tabs.map((tab, index) => (
        <Button
          key={index}
          onClick={() => handleTabClick(index, tab.id)}
          variant={activeTab === index ? "contained" : "text"}
          color="primary"
          sx={{
            mx: 1,
            px: 2,
            py: 1,
            borderRadius: (theme) => theme.shape.borderRadius,
            textTransform: "none",
            fontWeight: activeTab === index ? "medium" : "regular",
            color: activeTab === index ? "primary.contrastText" : "text.secondary",
            bgcolor: activeTab === index ? "primary.main" : "transparent",
            boxShadow: activeTab === index ? (theme) => theme.shadows[1] : "none",
            "&:hover": {
              bgcolor: activeTab === index ? "primary.dark" : "action.hover",
              color: activeTab === index ? "primary.contrastText" : "text.primary",
              boxShadow: (theme) => theme.shadows[2],
            },
            transition: "all 0.2s",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{tab.label}</Typography>
            {tab.label === "Đánh giá" && totalReviews > 0 && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: "background.default",
                  color: "text.secondary",
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  px: 1,
                  py: 0.25,
                }}
              >
                ({totalReviews})
              </Typography>
            )}
          </Box>
        </Button>
      ))}
    </Box>
  );
}

export default Tabs;
