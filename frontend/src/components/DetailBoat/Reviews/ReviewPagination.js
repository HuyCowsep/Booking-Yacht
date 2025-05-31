import React from "react";
import { Box, Stack, Button, IconButton, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReviewPagination = ({ currentPage, totalPages, onPageChange }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        mb: 8,
        bgcolor: "background.paper",
        borderColor: "divider",
        boxShadow: theme.shadows[1],
        borderRadius: "32px",
        p: 1,
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        {/* Nút "Trước" */}
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "9999px 0 0 9999px",
            "&:hover": { bgcolor: "action.hover" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
          }}
        >
          <ChevronLeft
            size={16}
            color={currentPage === 1 ? theme.palette.action.disabled : theme.palette.text.primary}
          />
          <Box
            component="span"
            sx={{ ml: 1, fontSize: "0.875rem", color: currentPage === 1 ? "action.disabled" : "text.primary" }}
          >
            Trước
          </Box>
        </IconButton>

        {/* Các nút số trang */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={page === currentPage ? "contained" : "outlined"}
            sx={{
              minWidth: 40,
              height: 42,
              borderRadius: "50%",
              borderColor: "divider",
              bgcolor: page === currentPage ? "primary.main" : "background.paper",
              color: page === currentPage ? "primary.contrastText" : "text.primary",
              "&:hover": {
                bgcolor: page === currentPage ? "primary.dark" : "action.hover",
                borderColor: page === currentPage ? "primary.dark" : "primary.main",
              },
            }}
          >
            {page}
          </Button>
        ))}

        {/* Nút "Tiếp" */}
        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "0 9999px 9999px 0",
            "&:hover": { bgcolor: "action.hover" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
          }}
        >
          <Box
            component="span"
            sx={{ mr: 1, fontSize: "0.875rem", color: currentPage === totalPages ? "action.disabled" : "text.primary" }}
          >
            Sau
          </Box>
          <ChevronRight
            size={16}
            color={currentPage === totalPages ? theme.palette.action.disabled : theme.palette.text.primary}
          />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ReviewPagination;
