import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BedDouble,
  Building,
  Building2,
  Minus,
  Plus,
  User,
  X,
} from "lucide-react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import RoomModal from "./RoomModal";

import BookingRoomModal from "./Booking/BookingRoomModal";
import {
  incrementRoomQuantity,
  decrementRoomQuantity,
  setSelectedSchedule,
  setSelectedMaxPeople,
  clearSelection,
  resetBookingForm,
  setEditingBookingId,
  clearAllErrors,
  setSelectedYachtServices,
  setSelectedRoomQuantities as setSelectedRoomQuantitiesAction, // đổi tên tránh trùng useState
} from "../../redux/actions/bookingActions";
import {
  openRoomModal,
  closeRoomModal,
  openBookingModal,
  closeBookingModal,
} from "../../redux/actions/uiActions";
import {
  fetchSchedulesOnly,
  fetchRoomsOnly,
} from "../../redux/asyncActions/bookingAsyncActions";
import RoomServicesModal from "./RoomServicesModal";
import { formatPrice } from "../../redux/validation";
import Swal from "sweetalert2";
import GuestCounter from "./Booking/GuestCounter";

// Đặt hàm này ngay sau import, trước function RoomSelector
const getRoomQuantity = (room) => {
  if (typeof room.quantity === "object" && room.quantity.$numberLong) {
    return parseInt(room.quantity.$numberLong, 10);
  }
  return room.quantity;
};

function RoomSelector({ yachtId, yachtData = {} }) {
  const dispatch = useDispatch();

  // Select state from Redux store
  const {
    rooms,
    schedules,
    loading,
    error,
    selectedSchedule,
    selectedMaxPeople,
    selectedYachtServices,
    maxPeopleOptions,
  } = useSelector((state) => state.booking);
  const { showRoomModal, showBookingModal, selectedRoomForModal } = useSelector(
    (state) => state.ui.modals
  );
  const [editBookingData, setEditBookingData] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  // Thêm state quản lý số lượng phòng đã chọn
  const [selectedRoomQuantities, setSelectedRoomQuantities] = useState({});

  useEffect(() => {
    if (yachtId) {
      dispatch(fetchSchedulesOnly(yachtId));
    } else {
      dispatch(clearSelection());
    }
  }, [yachtId, dispatch]);

  useEffect(() => {
    if (yachtId && selectedSchedule) {
      dispatch(fetchRoomsOnly(yachtId, selectedSchedule));
    }
  }, [yachtId, selectedSchedule, dispatch]);

  // Nếu rooms thay đổi (do chỉnh sửa tư vấn), đồng bộ lại selectedRoomQuantities
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const initialQuantities = {};
      rooms.forEach((room) => {
        initialQuantities[room.id || room._id] = 0;
      });
      setSelectedRoomQuantities(initialQuantities);
    }
  }, [rooms]);

  useEffect(() => {
    // Tính tổng số phòng đã chọn
    const totalSelectedRooms = Object.values(selectedRoomQuantities).reduce(
      (sum, qty) => sum + qty,
      0
    );
    // Nếu có dịch vụ đã chọn, kiểm tra và cập nhật lại số lượng khách cho từng dịch vụ nếu cần
    if (selectedYachtServices && selectedYachtServices.length > 0) {
      let changed = false;
      const updatedServices = selectedYachtServices.map((sv) => {
        if ((sv.quantity || 1) > totalSelectedRooms) {
          changed = true;
          return { ...sv, quantity: totalSelectedRooms };
        }
        return sv;
      });
      if (changed) {
        dispatch(setSelectedYachtServices(updatedServices));
      }
    }
  }, [selectedRoomQuantities]);

  // Hàm lấy danh sách phòng đã chọn để gửi lên BE/Redux
  const getSelectedRoomsForBooking = () => {
    return rooms
      .filter((room) => (selectedRoomQuantities[room.id || room._id] || 0) > 0)
      .map((room) => ({
        roomId: room.id || room._id,
        quantity: selectedRoomQuantities[room.id || room._id] || 0,
        name: room.name,
        price: room.price,
        area: room.area,
        max_people: room.max_people,
        roomTypeId: room.roomTypeId,
        yachtId: room.yachtId,
      }));
  };

  // Sửa handleBookNow để đồng bộ với Redux
  const handleBookNow = () => {
    dispatch(setSelectedRoomQuantitiesAction(selectedRoomQuantities));
    dispatch(resetBookingForm());
    dispatch(clearAllErrors());
    dispatch(setEditingBookingId(null));
    dispatch(openBookingModal());
  };

  // Reset selectedRoomQuantities khi đóng modal hoặc clear selection
  const handleCloseBookingModal = () => {
    dispatch(closeBookingModal());
    // Reset số lượng phòng đã chọn
    const initialQuantities = {};
    rooms.forEach((room) => {
      initialQuantities[room.id || room._id] = 0;
    });
    setSelectedRoomQuantities(initialQuantities);
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
    dispatch(setSelectedSchedule(""));
    dispatch(setSelectedMaxPeople("all"));
    // Reset số lượng phòng đã chọn
    const initialQuantities = {};
    rooms.forEach((room) => {
      initialQuantities[room.id || room._id] = 0;
    });
    setSelectedRoomQuantities(initialQuantities);
  };

  const handleOpenRoomModal = (room) => {
    dispatch(openRoomModal(room));
  };
  const handleSelectYachtServices = (services) => {
    dispatch(setSelectedYachtServices(services));
    setShowServiceModal(false);
  };

  // Hàm tăng số lượng phòng đã chọn
  const handleIncrementRoom = (roomId) => {
    const room = rooms.find((r) => (r.id || r._id) === roomId);
    const selectedQuantity = selectedRoomQuantities[roomId] || 0;
    const availableQuantity = getRoomQuantity(room);
    if (selectedQuantity < availableQuantity) {
      setSelectedRoomQuantities((prev) => ({
        ...prev,
        [roomId]: selectedQuantity + 1,
      }));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Đã đạt số lượng phòng tối đa!",
        text: `Bạn không thể chọn quá số lượng phòng còn lại cho loại phòng này.`,
        confirmButtonText: "OK",
      });
    }
    console.log(
      `Phòng: ${room.name}, Đã chọn: ${selectedQuantity}, Số lượng còn lại: ${availableQuantity}`
    );
  };

  // Hàm giảm số lượng phòng đã chọn
  const handleDecrementRoom = (roomId) => {
    const selectedQuantity = selectedRoomQuantities[roomId] || 0;
    if (selectedQuantity > 0) {
      setSelectedRoomQuantities((prev) => ({
        ...prev,
        [roomId]: selectedQuantity - 1,
      }));
    }
  };

  // Filter rooms theo số người tối đa (max_people)
  const filteredRooms =
    selectedMaxPeople === "all"
      ? rooms
      : rooms.filter((room) => room.max_people === parseInt(selectedMaxPeople));
  const getSelectedRooms = () => {
    return rooms.filter((room) => getRoomQuantity(room) > 0);
  };

  // Thêm hàm tính tổng sức chứa các phòng đã chọn
  const getMaxPeopleForSelectedRooms = () => {
    return rooms.reduce((total, room) => {
      const qty = selectedRoomQuantities[room.id || room._id] || 0;
      return total + (room.max_people || 0) * qty;
    }, 0);
  };

  // Tính tổng tiền dịch vụ theo du thuyền
  const guestCount = Object.values(selectedRoomQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalRoomPrice = rooms.reduce(
    (sum, room) =>
      sum +
      (selectedRoomQuantities[room.id || room._id] || 0) * (room.price || 0),
    0
  );
  const totalServicePrice = selectedYachtServices.reduce(
    (sum, sv) =>
      sum +
      sv.price *
        Math.min(
          sv.quantity || 1,
          guestCount // hoặc tổng số khách thực tế
        ),
    0
  );
  const totalPrice = totalRoomPrice + totalServicePrice;

  return (
    <div>
      <h2 className="text-4xl font-bold light:text-gray-900">
        Các loại phòng & giá
      </h2>
      <img src="../icons/heading-border.webp" alt="Divider" className="my-6" />
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          padding: 5,
          borderRadius: "30px",
          boxShadow: 3,
        }}
      >
        {/* Nút chọn dịch vụ cho toàn bộ du thuyền */}
        <Box className="flex justify-end mb-4">
          <Button
            onClick={handleClearSelection}
            variant="outlined"
            startIcon={<X size={20} />}
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              borderRadius: "20px",
              textTransform: "none",
              borderColor: (theme) => theme.palette.purple.main,
              color: (theme) => theme.palette.purple.main,
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                borderColor: (theme) => theme.palette.purple.dark,
                color: (theme) => theme.palette.purple.dark,
                backgroundColor: (theme) => theme.palette.background.default,
                boxShadow: (theme) => theme.shadows[2],
                transform: "translateY(-1px)",
              },
              "&:active::after": {
                content: '""',
                position: "absolute",
                width: "100px",
                height: "100px",
                background: (theme) => theme.palette.purple.main,
                borderRadius: "50%",
                opacity: 0.3,
                animation: "ripple 0.6s linear",
                transform: "scale(0)",
                pointerEvents: "none",
              },
              "@keyframes ripple": {
                to: {
                  transform: "scale(4)",
                  opacity: 0,
                },
              },
            }}
          >
            Xoá lựa chọn
          </Button>
        </Box>

        {/* Danh sách chọn lịch trình (hiển thị chi tiết ngày tháng nào) */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ minWidth: 220 }}
            margin="normal"
          >
            <InputLabel>Chọn lịch trình</InputLabel>
            <Select
              value={selectedSchedule}
              onChange={(e) => dispatch(setSelectedSchedule(e.target.value))}
              label="Chọn lịch trình"
              disabled={
                loading ||
                !(schedules[yachtId] && schedules[yachtId].length > 0)
              }
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderColor: (theme) => theme.palette.divider,
                boxShadow: (theme) => theme.shadows[1],
                color: (theme) => theme.palette.primary.main,
              }}
            >
              {(schedules[yachtId] || [])
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.scheduleId.startDate) -
                    new Date(b.scheduleId.startDate)
                )
                .map((schedule) => (
                  <MenuItem key={schedule._id} value={String(schedule._id)}>
                    {schedule.displayText ||
                      `${schedule.days || ""} ngày ${
                        schedule.nights || ""
                      } đêm (từ ${
                        schedule.scheduleId?.startDate
                          ? new Date(
                              schedule.scheduleId.startDate
                            ).toLocaleDateString("vi-VN")
                          : ""
                      } đến ${
                        schedule.scheduleId?.endDate
                          ? new Date(
                              schedule.scheduleId.endDate
                            ).toLocaleDateString("vi-VN")
                          : ""
                      })`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Filter số lượng người */}
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ minWidth: 180 }}
            margin="normal"
          >
            <InputLabel>Chọn số người</InputLabel>
            <Select
              value={selectedMaxPeople}
              onChange={(e) => dispatch(setSelectedMaxPeople(e.target.value))}
              label="Chọn số người"
              disabled={loading || maxPeopleOptions.length === 0}
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderColor: (theme) => theme.palette.divider,
                boxShadow: (theme) => theme.shadows[1],
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {maxPeopleOptions.map((num) => (
                <MenuItem key={num} value={String(num)}>
                  {num} người
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Typography sx={{ color: "text.primary", p: 2 }}>
            Đang tải dữ liệu...
          </Typography>
        )}
        {error && (
          <Typography sx={{ color: "text.primary", p: 2 }}>{error}</Typography>
        )}

        {selectedSchedule && (
          <>
            {loading && (
              <Typography sx={{ color: "text.primary", p: 2 }}>
                Đang tải phòng...
              </Typography>
            )}
            {!loading && !error && filteredRooms.length === 0 && (
              <Typography sx={{ color: "text.primary", p: 2 }}>
                Không tìm thấy phòng phù hợp với lựa chọn này
              </Typography>
            )}
            {filteredRooms.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {filteredRooms.map((room) => {
                    const availableQuantity = getRoomQuantity(room);
                    console.log("DEBUG ROOM:", room);
                    console.log(
                      `Tên phòng: ${room.name}, room.quantity raw:`,
                      room.quantity,
                      ", availableQuantity:",
                      availableQuantity
                    );
                    return (
                      <Box
                        key={room.id}
                        sx={{
                          bgcolor: "background.paper",
                          p: 2,
                          borderRadius: (theme) => theme.shape.borderRadius / 5,
                          boxShadow: (theme) => theme.shadows[1],
                          border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: { xs: "wrap", sm: "nowrap" },
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: "text.primary",
                          }}
                        >
                          <Box
                            component="img"
                            src={room.image}
                            alt={room.name}
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 2,
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenRoomModal(room)}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                textDecoration: "underline",
                                cursor: "pointer",
                                color: "text.primary",
                                "&:hover": { color: "primary.main" },
                              }}
                              onClick={() => handleOpenRoomModal(room)}
                            >
                              {room.name}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                fontWeight: "medium",
                                fontSize: "0.875rem",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <BedDouble
                                  size={16}
                                  className="text-teal-600"
                                />
                                <p className="mb-0 ">{room.area} m²</p>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <User size={16} className="text-teal-600" />
                                <p className="mb-0">
                                  {room.max_people || 0} người
                                </p>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                {room.roomTypeId && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <Building
                                      size={16}
                                      className="text-teal-600"
                                    />
                                    <p className="mb-0">
                                      {room.roomTypeId.type ||
                                        "Phòng tiêu chuẩn"}
                                    </p>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignContent: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "primary.main",
                                    fontSize: "1.125rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatPrice(room.price)}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "primary.main",
                                    fontSize: "1.125rem",
                                    fontWeight: "medium",
                                  }}
                                >
                                  {" "}
                                  / phòng
                                </Typography>
                              </Box>

                              <Typography
                                sx={{
                                  fontSize: "0.7rem",
                                  color: "text.secondary",
                                  fontStyle: "italic",
                                }}
                              >
                                Còn lại:{" "}
                                {getRoomQuantity(room) -
                                  (selectedRoomQuantities[
                                    room.id || room._id
                                  ] || 0)}{" "}
                                phòng
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                              borderRadius: (theme) =>
                                theme.shape.borderRadius / 2,
                              bgcolor: "background.paper",
                              boxShadow: (theme) => theme.shadows[1],
                            }}
                          >
                            <Button
                              onClick={() =>
                                handleDecrementRoom(room.id || room._id)
                              }
                              sx={{
                                minWidth: 32,
                                height: 32,
                                borderRadius: "50%",
                                color: "text.primary",
                                "&:hover": { bgcolor: "background.default" },
                              }}
                            >
                              <Minus size={16} />
                            </Button>
                            <Typography
                              sx={{
                                mx: 1,
                                width: "auto",
                                textAlign: "center",
                                color: "text.primary",
                              }}
                            >
                              {selectedRoomQuantities[room.id || room._id] || 0}
                            </Typography>
                            <Button
                              onClick={() =>
                                handleIncrementRoom(room.id || room._id)
                              }
                              sx={{
                                minWidth: 32,
                                height: 32,
                                borderRadius: "50%",
                                color: "text.primary",
                                "&:hover": { bgcolor: "background.default" },
                              }}
                            >
                              <Plus size={16} />
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {Object.values(selectedRoomQuantities).some(
                  (qty) => qty > 0
                ) && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => setShowServiceModal(true)}
                      variant="outlined"
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: "1rem",
                        borderColor: (theme) => theme.palette.purple.main,
                        color: (theme) => theme.palette.purple.main,
                        mr: 2,
                        width: "fit-content",
                        height: "fit-content",
                      }}
                    >
                      Chọn dịch vụ
                    </Button>
                    <Box
                      sx={{
                        border: "1px solid white",
                        width: "fit-content",
                        p: 2,
                        borderRadius: (theme) => theme.shape.borderRadius / 6,
                        boxShadow: (theme) => theme.shadows[1],
                        bgcolor: "background.paper",
                      }}
                    >
                      {rooms
                        .filter(
                          (room) =>
                            (selectedRoomQuantities[room.id || room._id] || 0) >
                            0
                        )
                        .map((room) => {
                          const selectedQty =
                            selectedRoomQuantities[room.id || room._id] || 0;
                          const roomTotal = room.price * selectedQty;
                          return (
                            <Box
                              key={room.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  color: "text.primary",
                                  fontFamily: "Archivo, sans-serif",
                                  display: "flex",
                                  gap: 1,
                                }}
                              >
                                <Building2 size={20} />
                                <p>
                                  {room.name} x {selectedQty}:{" "}
                                  {formatPrice(roomTotal)}(
                                  {formatPrice(room.price)}/phòng)
                                </p>
                              </Typography>
                            </Box>
                          );
                        })}
                      {/* Hiển thị dịch vụ đã chọn */}
                      {selectedYachtServices.length > 0 && (
                        <Box>
                          {selectedYachtServices.map((sv, idx) => (
                            <Box
                              key={sv.id || idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                fontWeight: "semibold",
                                justifyContent: "space-between",
                                fontSize: "0.875rem",
                                color: "text.secondary",
                                fontFamily: "Archivo, sans-serif",
                              }}
                            >
                              <Box>
                                <li>
                                  {sv.serviceName}: {formatPrice(sv.price)} x{" "}
                                  {Math.min(
                                    sv.quantity || 1,
                                    rooms.reduce(
                                      (sum, room) =>
                                        sum + getRoomQuantity(room),
                                      0
                                    )
                                  )}{" "}
                                  khách ={" "}
                                  {formatPrice(
                                    sv.price *
                                      Math.min(
                                        sv.quantity || 1,
                                        rooms.reduce(
                                          (sum, room) =>
                                            sum + getRoomQuantity(room),
                                          0
                                        )
                                      )
                                  )}
                                </li>
                              </Box>
                              <X
                                size={16}
                                style={{
                                  cursor: "pointer",
                                  color: "#e57373",
                                  border: "1px solid #e57373",
                                  borderRadius: "50%",
                                  padding: "2px",
                                }}
                                onClick={() => {
                                  dispatch(
                                    setSelectedYachtServices(
                                      selectedYachtServices.filter(
                                        (item, i) =>
                                          (item.id || i) !== (sv.id || idx)
                                      )
                                    )
                                  );
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
                      {/* Tổng phụ */}
                      <Box sx={{ mt: 1, ml: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            color: "text.primary",
                            fontFamily: "Archivo, sans-serif",
                          }}
                        >
                          Tổng tiền phòng:{" "}
                          {rooms
                            .filter(
                              (room) =>
                                (selectedRoomQuantities[room.id || room._id] ||
                                  0) > 0
                            )
                            .reduce(
                              (sum, room) =>
                                sum +
                                (room.price || 0) *
                                  (selectedRoomQuantities[
                                    room.id || room._id
                                  ] || 0),
                              0
                            )
                            .toLocaleString()}{" "}
                          đ
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            color: "text.primary",
                            fontFamily: "Archivo, sans-serif",
                          }}
                        >
                          Tổng tiền dịch vụ:{" "}
                          {totalServicePrice.toLocaleString()} đ
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: (theme) => theme.shape.borderRadius / 2,
                    boxShadow: (theme) => theme.shadows[1],
                    bgcolor: "background.paper",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "background.default",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "1rem",
                        fontWeight: "medium",
                      }}
                    >
                      Tổng tiền ước tính:
                    </Typography>
                    <Typography
                      sx={{
                        color: "primary.main",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      {totalPrice.toLocaleString()} đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      onClick={handleBookNow}
                      variant="contained"
                      sx={{
                        borderRadius: (theme) => theme.shape.borderRadius / 2,
                        textTransform: "none",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        px: 3,
                        py: 1,
                        display: "flex",
                        gap: 1,
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: "semibold",
                          fontFamily: "Archivo, sans-serif",
                        }}
                      >
                        Đặt ngay
                      </span>
                      <Box
                        component="svg"
                        sx={{ width: 16, height: 16, fill: "currentColor" }}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      <RoomModal
        show={showRoomModal}
        room={selectedRoomForModal}
        onClose={() => dispatch(closeRoomModal())}
        onIncrement={(roomId) => dispatch(incrementRoomQuantity(roomId))}
        onDecrement={(roomId) => dispatch(decrementRoomQuantity(roomId))}
      />

      {/* chọn phòng */}
      <BookingRoomModal
        show={showBookingModal}
        onClose={handleCloseBookingModal}
        selectedRooms={getSelectedRoomsForBooking()}
        selectedYachtServices={selectedYachtServices}
        yachtData={yachtData}
        onBack={null}
        editData={editBookingData}
        maxPeople={getMaxPeopleForSelectedRooms()}
        selectedSchedule={selectedSchedule}
      />

      <RoomServicesModal
        show={showServiceModal}
        yachtId={yachtId}
        onClose={() => setShowServiceModal(false)}
        onSelectServices={handleSelectYachtServices}
        selectedServices={selectedYachtServices}
        guestCount={Object.values(selectedRoomQuantities).reduce(
          (sum, qty) => sum + qty,
          0
        )}
      />
    </div>
  );
}

export default RoomSelector;
