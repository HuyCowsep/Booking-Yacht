import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Pagination } from "@mui/material";
import { setCurrentPage } from "../../redux/actions";

const PaginationSection = ({
  totalPages,
  filteredYachts,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state) => state.filters || {});

  // Đảm bảo currentPage không vượt quá totalPages hoặc nhỏ hơn 1
  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  const startItem = filteredYachts.length === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, filteredYachts.length);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Typography
        fontFamily="Archivo, sans-serif"
        variant="body2"
        color="text.secondary"
        sx={{
          mr: 1,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          backgroundColor: (theme) => theme.palette.background.paper,
          padding: "5px 10px",
          borderRadius: "32px",
          boxShadow: (theme) => theme.shadows[1],
          borderColor: (theme) => theme.palette.divider,
        }}
      >
        Đang xem :{" "}
        <Box
          component="span"
          sx={{
            padding: "5px 10px",
            border: (theme) => `2px solid ${theme.palette.divider}`,
            borderRadius: "100%",
            margin: "0 5px",
            color: "text.primary",
          }}
        >
          {endItem}
        </Box>{" "}
        trong tổng số {filteredYachts.length} kết quả
      </Typography>
      <Pagination
        count={totalPages}
        page={validPage}
        onChange={(event, value) => dispatch(setCurrentPage(value))}
        color="info"
        showFirstButton
        showLastButton
        sx={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          backgroundColor: (theme) => theme.palette.background.paper,
          padding: "5px 10px",
          borderRadius: "32px",
          boxShadow: (theme) => theme.shadows[1],
          borderColor: (theme) => theme.palette.divider,
          "& .MuiPaginationItem-root": {
            color: "text.primary",
          },
        }}
      />
    </Box>
  );
};

export default PaginationSection;
