import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { Box, Typography, Button } from "@mui/material";
import {
  setGuestCounterOpen,
  updateAdults,
} from "../../../redux/actions/bookingActions";

const GuestCounter = ({ maxPeople, minAdults = 1 }) => {
  const dispatch = useDispatch();
  const {
    guestCounter: { isOpen, adults, childrenUnder10 = 0, childrenAbove10 = 0 },
    bookingForm: { guestCount },
  } = useSelector((state) => state.booking);

  const [error, setError] = useState("");

  const totalGuests = adults + Math.floor(childrenAbove10 / 2);
  const overLimit = maxPeople && totalGuests > maxPeople;

  const handleUpdateAdults = (delta) => {
    const newAdults = adults + delta;
    const newTotalGuests = newAdults + Math.floor(childrenAbove10 / 2);

    if (delta > 0 && maxPeople && newTotalGuests > maxPeople) {
      setError(
        `Tổng số khách quy đổi (${newTotalGuests}) không được vượt quá sức chứa tối đa (${maxPeople}) của các phòng đã chọn. 2 trẻ em trên 10 tuổi = 1 người lớn.`
      );
      return;
    }
    if (newAdults < minAdults) {
      setError(
        `Mỗi phòng cần ít nhất 1 người lớn. Bạn đã chọn ${minAdults} phòng.`
      );
      return;
    }
    setError("");
    dispatch(updateAdults(delta));
  };

  const handleUpdateChildrenUnder10 = (delta) => {
    if (delta > 0 && childrenUnder10 + delta > 20) {
      setError("Nếu muốn nhiều hơn cần liên lạc với tư vấn viên.");
      return;
    }
    setError("");
    dispatch({ type: "UPDATE_CHILDREN_UNDER_10", payload: delta });
  };

  const handleUpdateChildrenAbove10 = (delta) => {
    const newChildrenAbove10 = childrenAbove10 + delta;
    const newTotalGuests = adults + Math.floor(newChildrenAbove10 / 2);

    if (delta > 0 && maxPeople && newTotalGuests > maxPeople) {
      setError(
        `Tổng số khách quy đổi (${newTotalGuests}) không được vượt quá sức chứa tối đa (${maxPeople}) của các phòng đã chọn. 2 trẻ em trên 10 tuổi = 1 người lớn.`
      );
      return;
    }
    setError("");
    dispatch({ type: "UPDATE_CHILDREN_ABOVE_10", payload: delta });
  };

  // Kiểm tra xem có thể thêm người lớn không
  const canAddAdults =
    !maxPeople || adults + Math.floor(childrenAbove10 / 2) < maxPeople;

  // Kiểm tra xem có thể thêm trẻ em từ 10 tuổi không
  const canAddChildrenAbove10 =
    !maxPeople || adults + Math.floor((childrenAbove10 + 1) / 2) <= maxPeople;

  // Kiểm tra xem có thể thêm trẻ em dưới 10 tuổi không
  const canAddChildrenUnder10 = childrenUnder10 < 20;

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        onClick={() => dispatch(setGuestCounterOpen(!isOpen))}
        sx={{
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: (theme) => theme.shape.borderRadius / 5,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontFamily: "Archivo, sans-serif",
          boxShadow: (theme) => theme.shadows[1],
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        <Typography
          sx={{ color: "text.primary", fontFamily: "Archivo, sans-serif" }}
        >
          {guestCount}
        </Typography>
        <Box
          component="svg"
          sx={{
            width: 20,
            height: 20,
            color: "text.secondary",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            fontFamily: "Archivo, sans-serif",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </Box>
      </Box>
      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            bgcolor: "background.paper",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: (theme) => theme.shape.borderRadius / 5,
            boxShadow: (theme) => theme.shadows[1],
            p: 3,
            zIndex: 50,
            fontFamily: "Archivo, sans-serif",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "medium",
                color: "text.primary",
                fontFamily: "Archivo, sans-serif",
              }}
            >
              Người lớn
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => handleUpdateAdults(-1)}
                disabled={adults <= minAdults}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <Minus size={16} />
              </Button>
              <Typography
                sx={{
                  mx: 2,
                  width: 20,
                  textAlign: "center",
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                }}
              >
                {adults}
              </Typography>
              <Button
                onClick={() => handleUpdateAdults(1)}
                disabled={!canAddAdults}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                    bgcolor: "grey.100",
                  },
                }}
                title={!canAddAdults ? "Đã đạt giới hạn sức chứa tối đa" : ""}
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "medium",
                color: "text.primary",
                fontFamily: "Archivo, sans-serif",
              }}
            >
              Trẻ em{" "}
              <span style={{ color: "error.main", fontSize: "0.75rem" }}>
                (dưới 10 tuổi)
              </span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => handleUpdateChildrenUnder10(-1)}
                disabled={childrenUnder10 <= 0}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <Minus size={16} />
              </Button>
              <Typography
                sx={{
                  mx: 2,
                  width: 20,
                  textAlign: "center",
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                }}
              >
                {childrenUnder10}
              </Typography>
              <Button
                onClick={() => handleUpdateChildrenUnder10(1)}
                disabled={!canAddChildrenUnder10}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                    bgcolor: "grey.100",
                  },
                }}
                title={
                  !canAddChildrenUnder10
                    ? "Đã đạt giới hạn tối đa (20 trẻ em)"
                    : ""
                }
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "error.main",
              ml: 1,
              mb: 1,
              fontFamily: "Archivo, sans-serif",
            }}
          >
            Không tính vào tổng sức chứa (tối đa 20)
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              fontFamily: "Archivo, sans-serif",
            }}
          >
            <Typography
              sx={{
                fontWeight: "medium",
                color: "text.primary",
                fontFamily: "Archivo, sans-serif",
              }}
            >
              Trẻ em{" "}
              <span style={{ color: "error.main", fontSize: "0.75rem" }}>
                (từ 10 tuổi)
              </span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => handleUpdateChildrenAbove10(-1)}
                disabled={childrenAbove10 <= 0}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                <Minus size={16} />
              </Button>
              <Typography
                sx={{
                  mx: 2,
                  width: 20,
                  textAlign: "center",
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                }}
              >
                {childrenAbove10}
              </Typography>
              <Button
                onClick={() => handleUpdateChildrenAbove10(1)}
                disabled={!canAddChildrenAbove10}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  color: "text.primary",
                  fontFamily: "Archivo, sans-serif",
                  "&:hover": { bgcolor: "background.default" },
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                    bgcolor: "grey.100",
                  },
                }}
                title={
                  !canAddChildrenAbove10
                    ? "Đã đạt giới hạn sức chứa tối đa"
                    : ""
                }
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "error.main",
              ml: 1,
              mb: 1,
              fontFamily: "Archivo, sans-serif",
            }}
          >
            2 trẻ em từ 10 tuổi = 1 người lớn
          </Typography>
          {error && (
            <Typography
              sx={{
                color: "error.main",
                fontSize: "0.75rem",
                mt: 1,
                fontWeight: "medium",
                fontFamily: "Archivo, sans-serif",
              }}
            >
              {error}
            </Typography>
          )}
          {overLimit && (
            <Typography
              sx={{
                color: "error.main",
                fontSize: "0.75rem",
                mt: 1,
                fontWeight: "medium",
                fontFamily: "Archivo, sans-serif",
              }}
            >
              Tổng số khách quy đổi ({totalGuests}) vượt quá sức chứa tối đa (
              {maxPeople}) của các phòng đã chọn.
            </Typography>
          )}
          {/* Hiển thị tổng khách quy đổi */}
          <Box
            sx={{
              border: overLimit ? "1px solid #4f908a" : "1px solid #68bfb5",
              color: "primary.main",
              p: 0.5,
              borderRadius: 1,
              mt: 1,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: "bold",
                fontFamily: "Archivo, sans-serif",
              }}
            >
              Tổng khách quy đổi: {totalGuests} người
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                opacity: 0.9,
                fontFamily: "Archivo, sans-serif",
              }}
            >
              {maxPeople
                ? `Sức chứa tối đa: ${maxPeople} người`
                : "Không giới hạn sức chứa"}
            </Typography>
            {maxPeople && (
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  opacity: 0.8,
                  fontFamily: "Archivo, sans-serif",
                  mt: 0.5,
                }}
              >
                {totalGuests > maxPeople ? (
                  `⚠️ Vượt quá ${totalGuests - maxPeople} người`
                ) : totalGuests === maxPeople ? (
                  <Typography sx={{ color: "error.main", fontSize: "0.7rem" }}>
                    ⚠️ Đã đạt giới hạn tối đa
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "success.main", fontSize: "0.7rem" }}
                  >
                    ✅ Còn {maxPeople - totalGuests} chỗ trống
                  </Typography>
                )}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              my: 1,
            }}
          />
          <Button
            onClick={() => {
              let guestCountText = `${adults} người lớn`;
              if (childrenAbove10 > 0)
                guestCountText += `, ${childrenAbove10} trẻ em từ 10 tuổi`;
              if (childrenUnder10 > 0)
                guestCountText += `, ${childrenUnder10} trẻ em dưới 10 tuổi (không tính vào tổng khách)`;
              dispatch({
                type: "UPDATE_BOOKING_FORM",
                payload: { field: "guestCount", value: guestCountText },
              });
              dispatch(setGuestCounterOpen(false));
            }}
            variant="contained"
            sx={{
              width: "100%",
              py: 1.5,
              mt: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              fontWeight: "medium",
              fontFamily: "Archivo, sans-serif",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Áp dụng
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GuestCounter;
