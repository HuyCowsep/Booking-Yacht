import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Container,
  CircularProgress,
  Grid,
  Avatar,
  Stack,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Fade,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerBookings } from "../redux/asyncActions/bookingAsyncActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { openTransactionModal } from "../redux/actions";
import { openInvoiceModal } from "../redux/actions/uiActions";
import { fetchInvoiceByBookingId } from "../redux/asyncActions/invoiceAsyncActions";
import {
  customerCancelBooking,
  deleteBookingById,
  fetchSchedulesOnly,
} from "../redux/asyncActions/bookingAsyncActions";
import Swal from "sweetalert2";
import { ListCollapse, Receipt, Trash } from "lucide-react";
import { getScheduleById } from "../utils/scheduleHelpers";

const statusMap = {
  consultation_requested: {
    label: "Chờ tư vấn",
    color: "warning",
    icon: <HourglassEmptyIcon color="warning" />,
    desc: "Yêu cầu tư vấn của bạn đang chờ xử lý.",
  },
  consultation_sent: {
    label: "Đã gửi tư vấn",
    color: "info",
    icon: <InfoIcon color="info" />,
    desc: "Nhân viên đã gửi tư vấn cho bạn.",
  },
  pending_payment: {
    label: "Chờ thanh toán",
    color: "warning",
    icon: <MonetizationOnIcon color="warning" />,
    desc: "Vui lòng thanh toán để xác nhận booking.",
  },
  confirmed: {
    label: "Đã đặt",
    color: "success",
    icon: <CheckCircleIcon color="success" />,
    desc: "Booking đã được đặt.",
  },
  completed: {
    label: "Hoàn thành",
    color: "primary",
    icon: <DoneAllIcon color="primary" />,
    desc: "Chuyến đi của bạn đã hoàn thành.",
  },
  cancelled: {
    label: "Đã huỷ",
    color: "error",
    icon: <CancelIcon color="error" />,
    desc: "Booking đã bị huỷ.",
  },
  rejected: {
    label: "Bị từ chối",
    color: "error",
    icon: <BlockIcon color="error" />,
    desc: "Booking đã bị từ chối.",
  },
  confirmed_deposit: {
    label: "Đã đặt cọc",
    color: "info",
    icon: <MonetizationOnIcon color="info" />,
    desc: "Bạn đã thanh toán đặt cọc.",
  },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}

// Countdown helper
function getCountdown(targetTime) {
  const now = new Date().getTime();
  const diff = targetTime - now;
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

function formatCountdown(cd) {
  if (!cd) return "Đã hết hạn";
  return `${cd.hours}h ${cd.minutes}m ${cd.seconds}s`;
}

export default function BookingHistory() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.customerBookings || []);
  const loading = useSelector((state) => state.booking.customerBookingsLoading);
  const error = useSelector((state) => state.booking.customerBookingsError);
  const schedules = useSelector((state) => state.booking.schedules);

  const [filterStatus, setFilterStatus] = useState("all");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingImages, setBookingImages] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [expandedServices, setExpandedServices] = useState({});
  const [page, setPage] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const bookingsPerPage = 3;
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const paginatedBookings = bookings.slice(
    (page - 1) * bookingsPerPage,
    page * bookingsPerPage
  );

  const [countdowns, setCountdowns] = useState({});
  const intervalRef = useRef();

  useEffect(() => {
    dispatch(fetchCustomerBookings());
  }, [dispatch]);

  useEffect(() => {
    const yachtIds = Array.from(
      new Set(bookings.map((b) => b.yacht?._id || b.yacht).filter(Boolean))
    );
    yachtIds.forEach((yachtId) => {
      dispatch(fetchSchedulesOnly(yachtId));
    });
  }, [bookings, dispatch]);

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  useEffect(() => {
    filteredBookings.forEach((booking) => {
      const yachtId = booking.yacht?._id || booking.yacht;
      if (yachtId && !bookingImages[booking._id]) {
        axios
          .get(`http://localhost:9999/api/v1/yachtImages/yacht/${yachtId}`)
          .then((res) => {
            const images = res.data.data || [];
            setBookingImages((prev) => ({
              ...prev,
              [booking._id]:
                images[0] ||
                `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                  booking.yacht?.name || "Yacht"
                )}`,
            }));
          })
          .catch(() => {
            setBookingImages((prev) => ({
              ...prev,
              [booking._id]: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                booking.yacht?.name || "Yacht"
              )}`,
            }));
          });
      }
    });
  }, [filteredBookings, bookingImages]);

  // Countdown logic
  useEffect(() => {
    function updateCountdowns() {
      const newCountdowns = {};
      bookings.forEach((booking) => {
        let target = null;
        if (
          ["pending_payment", "consultation_requested"].includes(booking.status)
        ) {
          target = new Date(booking.createdAt).getTime() + 60 * 60 * 1000;
        } else if (booking.status === "cancelled") {
          console.log(
            "DEBUG updateCountdowns: booking",
            booking._id,
            "cancelledAt:",
            booking.cancelledAt
          );
          if (booking.cancelledAt) {
            target =
              new Date(booking.cancelledAt).getTime() + 2 * 24 * 60 * 60 * 1000;
          }
        } else if (
          ["confirmed", "confirmed_deposit"].includes(booking.status)
        ) {
          // Lấy startDate của scheduleObj thay vì checkInDate
          const yachtKey = booking.yacht?._id || booking.yacht;
          const schedulesForYacht = schedules[yachtKey] || [];
          const scheduleObj = getScheduleById(
            schedulesForYacht,
            booking.schedule?._id || booking.scheduleId
          );
          const startDate =
            scheduleObj?.startDate || scheduleObj?.scheduleId?.startDate;
          if (startDate) {
            // Đếm ngược đến 24h trước startDate
            const startTime = new Date(startDate).getTime();
            target = startTime - 24 * 60 * 60 * 1000;
          } else {
            console.warn(
              `[BookingHistory] bookingId: ${booking._id} không tìm thấy startDate trong scheduleObj`,
              scheduleObj
            );
          }
        }
        if (target) {
          newCountdowns[booking._id] = getCountdown(target);
        }
      });
      setCountdowns(newCountdowns);
    }
    updateCountdowns();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateCountdowns, 1000);
    return () => clearInterval(intervalRef.current);
  }, [bookings, schedules]);

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  const handleOpenDetail = (booking) => {
    setSelectedBooking(booking);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedBooking(null);
  };

  const handlePageChange = (_, value) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(value);
      setTransitioning(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 250);
  };

  const handleViewInvoice = async (booking) => {
    // Nếu booking đã có invoiceData, mở luôn
    if (booking.invoiceData) {
      dispatch(openInvoiceModal(booking.invoiceData));
    } else {
      // Nếu chưa có, fetch từ backend
      const result = await dispatch(fetchInvoiceByBookingId(booking._id));
      if (result?.payload) {
        dispatch(openInvoiceModal(result.payload));
      }
    }
  };

  const handleDeleteBooking = (booking) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa booking này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D92C54",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteBookingById(booking._id));
      }
    });
  };

  const handleCancelBooking = (booking) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn hủy booking này?",
      text: "Sau khi hủy, bạn sẽ mất tiền cọc. Bạn có chắc chắn muốn tiếp tục?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D92C54",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Đóng",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(customerCancelBooking(booking._id));
      }
    });
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={(theme) => ({
        py: 4,
        px: { xs: 2, md: 4 }, // padding ngang cho responsive
        backgroundImage:
          theme.palette.mode === "light"
            ? 'url("https://images.pexels.com/photos/32699741/pexels-photo-32699741.jpeg")'
            : 'url("https://images.pexels.com/photos/2147485/pexels-photo-2147485.jpeg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      })}
    >
      <Container maxWidth="lg" className="py-2 bg-white/30 rounded-3xl">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            mb={3}
            fontWeight={700}
            sx={{
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: 2,
              px: 1,
              width: "fit-content",
            }}
          >
            Lịch sử booking của bạn
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mb={3}
            alignItems="center"
          >
            <FormControl
              size="small"
              sx={{
                borderRadius: 2,
                minWidth: 200,

                color: (theme) => theme.palette.primary.main,
                bgcolor: (theme) => theme.palette.background.paper,
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <InputLabel>Lọc theo trạng thái</InputLabel>
              <Select
                value={filterStatus}
                label="Lọc theo trạng thái"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                {Object.entries(statusMap).map(([key, val]) => (
                  <MenuItem value={key} key={key}>
                    {val.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
        {filteredBookings.length === 0 ? (
          <Typography textAlign="center">
            Không có booking nào phù hợp.
          </Typography>
        ) : (
          <>
            <div id="booking-list-top" />
            <Fade in={!transitioning} timeout={400}>
              <div>
                <Grid container spacing={2}>
                  {paginatedBookings.map((booking) => {
                    const status = statusMap[booking.status] || {};
                    const rooms =
                      booking.consultationData?.requestedRooms || [];
                    const services =
                      booking.consultationData?.requestServices || [];
                    const yachtImage =
                      booking.yacht?.image || bookingImages[booking._id];
                    const isRoomsExpanded = expandedRooms[booking._id];
                    const isServicesExpanded = expandedServices[booking._id];

                    const yachtKey = booking.yacht?._id || booking.yacht;
                    const schedulesForYacht = schedules[yachtKey] || [];
                    const scheduleObj = getScheduleById(
                      schedulesForYacht,
                      booking.schedule?._id || booking.scheduleId
                    );

                    // Countdown logic
                    let countdownText = null;
                    let scheduleStartDate = null;
                    if (scheduleObj?.startDate) {
                      scheduleStartDate = new Date(
                        scheduleObj.startDate
                      ).getTime();
                    }
                    if (
                      ["pending_payment", "consultation_requested"].includes(
                        booking.status
                      )
                    ) {
                      countdownText =
                        "Tự động huỷ sau: " +
                        formatCountdown(countdowns[booking._id]);
                    } else if (
                      booking.status === "cancelled" &&
                      booking.cancelledAt
                    ) {
                      const cd = countdowns[booking._id];
                      if (
                        cd &&
                        (cd.hours > 0 || cd.minutes > 0 || cd.seconds > 0)
                      ) {
                        countdownText =
                          "Tự động xoá sau: " + formatCountdown(cd);
                      } else {
                        countdownText = "Đã hết hạn xoá";
                      }
                    } else if (
                      ["confirmed", "confirmed_deposit"].includes(
                        booking.status
                      )
                    ) {
                      const cd = countdowns[booking._id];
                      if (
                        cd &&
                        (cd.hours > 0 || cd.minutes > 0 || cd.seconds > 0)
                      ) {
                        countdownText =
                          "Có thể huỷ đến 24h trước khi bắt đầu lịch trình: " +
                          formatCountdown(cd);
                      } else {
                        countdownText = "Đã hết hạn huỷ";
                      }
                    }
                    // Disable nút huỷ nếu không còn hợp lệ
                    let canCancel = true;
                    if (
                      ["confirmed", "confirmed_deposit"].includes(
                        booking.status
                      )
                    ) {
                      const cd = countdowns[booking._id];
                      if (
                        !cd ||
                        (cd.hours <= 0 && cd.minutes <= 0 && cd.seconds <= 0)
                      ) {
                        canCancel = false;
                      }
                    }

                    // DEBUG LOG
                    if (booking.status === "cancelled") {
                    }

                    return (
                      <Grid item xs={12} md={6} lg={4} key={booking._id}>
                        <Fade in timeout={500}>
                          <Paper
                            elevation={6}
                            sx={{
                              px: 3,
                              py: 2.5,
                              borderRadius: 4,
                              border: `1.5px solid #e0e0e0`,
                              minHeight: 370,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              transition: "box-shadow 0.2s, transform 0.2s",
                              "&:hover": {
                                boxShadow: 12,
                                transform: "translateY(-4px) scale(1.03)",
                                borderColor: "#90caf9",
                              },
                              bgcolor: (theme) =>
                                theme.palette.background.paper,
                              borderColor: (theme) => theme.palette.divider,
                              boxShadow: (theme) => theme.shadows[1],
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                              mb={2}
                            >
                              <Avatar
                                src={yachtImage}
                                alt={booking.yacht?.name || ""}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  border: "2px solid #90caf9",
                                  bgcolor: "#fff",
                                }}
                              >
                                {booking.yacht?.name?.[0] || "?"}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  color="primary.dark"
                                  noWrap
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    maxWidth: 250,
                                  }}
                                >
                                  {booking.yacht?.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Ngày đặt: {formatDate(booking.createdAt)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Lịch trình:{" "}
                                  {scheduleObj?.displayText ||
                                    (scheduleObj?.startDate &&
                                    scheduleObj?.endDate
                                      ? `${new Date(
                                          scheduleObj.startDate
                                        ).toLocaleDateString(
                                          "vi-VN"
                                        )} - ${new Date(
                                          scheduleObj.endDate
                                        ).toLocaleDateString("vi-VN")}`
                                      : "-")}
                                </Typography>
                              </Box>
                            </Stack>
                            <Typography
                              variant="body2"
                              color="primary.dark"
                              minHeight={32}
                              fontWeight={500}
                            >
                              {status.desc || ""}
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              mb={1}
                            >
                              {status.icon && (
                                <Tooltip title={status.label}>
                                  {status.icon}
                                </Tooltip>
                              )}
                              <Chip
                                label={status.label || booking.status}
                                color={status.color || "default"}
                                sx={{
                                  fontWeight: 600,
                                  fontSize: 16,
                                  px: 2,
                                  py: 1,
                                  borderRadius: 2,
                                }}
                              />
                            </Stack>
                            {/* Phòng đã đặt - tóm tắt */}
                            <Box mb={1} minHeight={40}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                color="primary.dark"
                                mb={0.5}
                              >
                                Phòng:
                              </Typography>
                              <Stack spacing={0.5} sx={{ minHeight: 28 }}>
                                {rooms.length > 0 ? (
                                  <>
                                    <Box display="flex" alignItems="center">
                                      <Typography
                                        key={rooms[0].roomId || 0}
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mr: 1 }}
                                      >
                                        •{" "}
                                        {rooms[0].roomId?.name ||
                                          rooms[0].roomName ||
                                          rooms[0].name ||
                                          "Phòng"}{" "}
                                        (x
                                        {rooms[0].quantity ||
                                          rooms[0].roomQuantity ||
                                          1}
                                        )
                                      </Typography>
                                      {rooms.length > 1 && !isRoomsExpanded && (
                                        <Button
                                          size="small"
                                          variant="text"
                                          sx={{
                                            px: 0.5,
                                            py: 0,
                                            border: "1px solid #66bdb3",
                                            borderRadius: "100%",
                                            fontSize: 12,
                                            minWidth: 0,
                                          }}
                                          onClick={() =>
                                            setExpandedRooms((prev) => ({
                                              ...prev,
                                              [booking._id]: true,
                                            }))
                                          }
                                        >
                                          +{rooms.length - 1}
                                        </Button>
                                      )}
                                    </Box>
                                    {isRoomsExpanded &&
                                      rooms
                                        .slice(1)
                                        .filter(
                                          (room) => !!room && !!room.roomId
                                        )
                                        .map((room, idx) => (
                                          <Typography
                                            key={room.roomId || idx + 1}
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            •{" "}
                                            {room.roomId?.name ||
                                              room.roomName ||
                                              room.name ||
                                              "Phòng"}{" "}
                                            (x
                                            {room.quantity ||
                                              room.roomQuantity ||
                                              1}
                                            )
                                          </Typography>
                                        ))}
                                    {isRoomsExpanded && rooms.length > 1 && (
                                      <Button
                                        size="small"
                                        variant="text"
                                        color="primary"
                                        sx={{
                                          minWidth: 0,
                                          px: 1,
                                          fontSize: 13,
                                          border: "1px solid #90caf9",
                                        }}
                                        onClick={() =>
                                          setExpandedRooms((prev) => ({
                                            ...prev,
                                            [booking._id]: false,
                                          }))
                                        }
                                      >
                                        Thu gọn
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      fontStyle: "italic",
                                      color: "#7e9ca7",
                                    }}
                                  >
                                    Không có phòng nào được chọn
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                            {/* Dịch vụ đã chọn - tóm tắt */}
                            <Box mb={1} minHeight={40}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                color="primary.dark"
                                mb={0.5}
                              >
                                Dịch vụ:
                              </Typography>
                              <Stack spacing={0.5} sx={{ minHeight: 28 }}>
                                {services.length > 0 ? (
                                  <>
                                    <Box display="flex" alignItems="center">
                                      <Typography
                                        key={services[0].serviceId || 0}
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mr: 1 }}
                                      >
                                        •{" "}
                                        {services[0].serviceId?.serviceName ||
                                          services[0].serviceId?.name ||
                                          services[0].serviceName ||
                                          services[0].name ||
                                          "Dịch vụ"}{" "}
                                        (x
                                        {services[0].quantity ||
                                          services[0].serviceQuantity ||
                                          1}
                                        )
                                      </Typography>
                                      {services.length > 1 &&
                                        !isServicesExpanded && (
                                          <Button
                                            size="small"
                                            variant="text"
                                            sx={{
                                              px: 0.5,
                                              py: 0,
                                              border: "1px solid #66bdb3",
                                              borderRadius: "100%",
                                              fontSize: 12,
                                              minWidth: 0,
                                            }}
                                            onClick={() =>
                                              setExpandedServices((prev) => ({
                                                ...prev,
                                                [booking._id]: true,
                                              }))
                                            }
                                          >
                                            +{services.length - 1}
                                          </Button>
                                        )}
                                    </Box>
                                    {isServicesExpanded &&
                                      services.slice(1).map((sv, idx) => (
                                        <Typography
                                          key={sv.serviceId || idx + 1}
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          •{" "}
                                          {sv.serviceId?.serviceName ||
                                            sv.serviceId?.name ||
                                            sv.serviceName ||
                                            sv.name ||
                                            "Dịch vụ"}{" "}
                                          (x
                                          {sv.quantity ||
                                            sv.serviceQuantity ||
                                            1}
                                          )
                                        </Typography>
                                      ))}
                                    {isServicesExpanded &&
                                      services.length > 1 && (
                                        <Button
                                          size="small"
                                          variant="text"
                                          sx={{
                                            minWidth: 0,
                                            px: 1,
                                            fontSize: 13,
                                          }}
                                          onClick={() =>
                                            setExpandedServices((prev) => ({
                                              ...prev,
                                              [booking._id]: false,
                                            }))
                                          }
                                        >
                                          Thu gọn
                                        </Button>
                                      )}
                                  </>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      fontStyle: "italic",
                                      color: "#7e9ca7",
                                    }}
                                  >
                                    Không có dịch vụ được chọn
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                            {countdownText && (
                              <Typography
                                color="secondary"
                                sx={{ fontSize: 12, fontWeight: 600 }}
                              >
                                {countdownText}
                              </Typography>
                            )}
                            <Box
                              mt={1.3}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-end"
                              minHeight={56}
                            >
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="primary.dark"
                                sx={{ alignSelf: "flex-end" }}
                              >
                                <b>Tổng tiền:</b>{" "}
                                {booking.paymentBreakdown.totalAmount.toLocaleString(
                                  "vi-VN"
                                )}
                                ₫
                              </Typography>
                              <Box
                                display="flex"
                                gap={1}
                                alignItems="flex-end"
                                justifyContent="flex-end"
                              >
                                {/* Các nút thao tác */}
                                {booking.status === "pending_payment" &&
                                  countdowns[booking._id] &&
                                  (countdowns[booking._id].hours > 0 ||
                                    countdowns[booking._id].minutes > 0 ||
                                    countdowns[booking._id].seconds > 0) && (
                                    <>
                                      <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        sx={{
                                          borderRadius: 2,
                                          fontWeight: 700,
                                          minWidth: 120,
                                        }}
                                        onClick={() => {
                                          dispatch(
                                            openTransactionModal(booking._id)
                                          );
                                        }}
                                      >
                                        Thanh toán
                                      </Button>
                                      <Button
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                          handleCancelBooking(booking)
                                        }
                                        sx={{ minWidth: 20 }}
                                        disabled={!canCancel}
                                      >
                                        <CancelIcon size={19} />
                                      </Button>
                                    </>
                                  )}
                                {["confirmed", "confirmed_deposit"].includes(
                                  booking.status
                                ) && (
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleCancelBooking(booking)}
                                    sx={{ minWidth: 20 }}
                                    disabled={!canCancel}
                                  >
                                    <CancelIcon size={19} />
                                  </Button>
                                )}
                                {booking.status === "pending_payment" &&
                                  !countdowns[booking._id] && (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      sx={{ minWidth: 20 }}
                                      onClick={() =>
                                        handleDeleteBooking(booking)
                                      }
                                    >
                                      <Trash size={20} />
                                    </Button>
                                  )}
                                {/* Nút xem chi tiết luôn hiển thị */}
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    borderRadius: 3,
                                    minWidth: 20,
                                  }}
                                  onClick={() => handleOpenDetail(booking)}
                                >
                                  <ListCollapse size={20} />
                                </Button>
                                {booking.status === "completed" && (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{
                                      borderRadius: 2,
                                      fontWeight: 700,
                                      minWidth: 120,
                                    }}
                                    onClick={() => handleViewInvoice(booking)}
                                  >
                                    <Receipt size={20} />
                                  </Button>
                                )}
                                {booking.status === "cancelled" && (
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    sx={{ minWidth: 20 }}
                                    onClick={() => handleDeleteBooking(booking)}
                                  >
                                    <Trash size={20} />
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </Paper>
                        </Fade>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </Fade>
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="medium"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  ".MuiPaginationItem-root": {
                    bgcolor: "#f5fafd",
                    borderRadius: 2,
                    fontWeight: 600,
                    mx: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                      boxShadow: 3,
                      transform: "scale(1.08)",
                    },
                  },
                  ".Mui-selected": {
                    bgcolor: "primary.main !important",
                    color: "white !important",
                    boxShadow: 4,
                    transform: "scale(1.12)",
                  },
                  ".MuiPaginationItem-previousNext": {
                    bgcolor: "#e3f2fd",
                    color: "primary.main",
                    borderRadius: "50%",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                      boxShadow: 3,
                      transform: "scale(1.15)",
                    },
                  },
                  ".MuiPaginationItem-firstLast": {
                    bgcolor: "#e3f2fd",
                    color: "primary.main",
                    borderRadius: "50%",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                      boxShadow: 3,
                      transform: "scale(1.15)",
                    },
                  },
                }}
              />
            </Box>
          </>
        )}
        {/* Modal chi tiết booking */}
        <Dialog
          open={openDetail}
          onClose={handleCloseDetail}
          maxWidth={"sm"}
          fullWidth
        >
          <DialogTitle
            bgcolor={"primary.main"}
            fontWeight={600}
            fontSize={24}
            color={"white"}
          >
            Chi tiết booking
          </DialogTitle>
          <DialogContent dividers>
            {selectedBooking && (
              <Box>
                {/* Ảnh + Tên + Trạng thái */}
                <Grid container spacing={2} alignItems="center" mb={2}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    display="flex"
                    justifyContent="center"
                  >
                    <Avatar
                      src={selectedBooking?.yacht?.image}
                      alt={selectedBooking?.yacht?.name || ""}
                      sx={{
                        width: 100,
                        height: 100,
                        border: "3px solid #90caf9",
                        bgcolor: "#fff",
                        boxShadow: 3,
                      }}
                    >
                      {selectedBooking?.yacht?.name?.[0] || "?"}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="primary.main"
                      noWrap
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: 300,
                      }}
                    >
                      {selectedBooking.yacht?.name}
                    </Typography>
                    <Chip
                      label={
                        statusMap[selectedBooking.status]?.label ||
                        selectedBooking.status
                      }
                      color={
                        statusMap[selectedBooking.status]?.color || "default"
                      }
                      icon={statusMap[selectedBooking.status]?.icon}
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Thông tin booking */}
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="primary.dark"
                  mb={1}
                >
                  Thông tin booking
                </Typography>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Mã booking:</b> {selectedBooking.bookingCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={600} display={"flex"} gap={1}>
                      <b>Tổng tiền: </b>
                      <Typography fontWeight={600} color="primary.dark">
                        {" "}
                        {selectedBooking.paymentBreakdown.totalAmount.toLocaleString(
                          "vi-VN"
                        )}
                        ₫
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Số khách:</b> {selectedBooking.guestCount}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Ngày đặt:</b> {formatDate(selectedBooking.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {/* Lấy object lịch trình từ scheduleId cho modal chi tiết */}
                    {(() => {
                      const yachtKey =
                        selectedBooking.yacht?._id || selectedBooking.yacht;
                      const schedulesForYacht = schedules[yachtKey] || [];
                      const scheduleObj = getScheduleById(
                        schedulesForYacht,
                        selectedBooking.schedule?._id ||
                          selectedBooking.scheduleId
                      );
                      return (
                        <Typography>
                          <b>Lịch trình:</b>{" "}
                          {scheduleObj?.displayText ||
                            (scheduleObj?.startDate && scheduleObj?.endDate
                              ? `${new Date(
                                  scheduleObj.startDate
                                ).toLocaleDateString("vi-VN")} - ${new Date(
                                  scheduleObj.endDate
                                ).toLocaleDateString("vi-VN")}`
                              : "-")}
                        </Typography>
                      );
                    })()}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Yêu cầu thêm:</b>{" "}
                      {selectedBooking.consultationData?.requirements ||
                        selectedBooking.requirements ||
                        "Không có"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Check-in:</b> {formatDate(selectedBooking.checkInDate)}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Thông tin khách hàng */}
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="primary.main"
                  mb={1}
                >
                  Thông tin khách hàng
                </Typography>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Họ tên:</b> {selectedBooking.customerInfo?.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>SĐT:</b> {selectedBooking.customerInfo?.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Email:</b> {selectedBooking.customerInfo?.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <b>Địa chỉ:</b>{" "}
                      {selectedBooking.customerInfo?.address || "Không có"}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Phòng đã đặt */}
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="primary.main"
                  mb={1}
                >
                  Phòng đã đặt
                </Typography>
                {selectedBooking.consultationData?.requestedRooms?.length >
                0 ? (
                  <Grid container spacing={1} mb={2}>
                    {selectedBooking.consultationData.requestedRooms.map(
                      (room, idx) => (
                        <Grid item xs={12} sm={6} key={room.roomId || idx}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, bgcolor: "background.default" }}
                          >
                            <Typography fontWeight={600}>
                              {room.roomId?.name ||
                                room.roomName ||
                                room.name ||
                                "Phòng"}{" "}
                              (x{room.quantity || room.roomQuantity || 1})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Giá phòng:{" "}
                              {room.roomId?.roomTypeId?.price
                                ? room.roomId.roomTypeId.price.toLocaleString(
                                    "vi-VN"
                                  )
                                : room.roomId?.price
                                ? room.roomId.price.toLocaleString("vi-VN")
                                : room.price
                                ? room.price.toLocaleString("vi-VN")
                                : room.roomPrice
                                ? room.roomPrice.toLocaleString("vi-VN")
                                : "-"}
                              ₫
                            </Typography>
                          </Paper>
                        </Grid>
                      )
                    )}
                  </Grid>
                ) : (
                  <Typography color="text.secondary" mb={2}>
                    Không có thông tin phòng.
                  </Typography>
                )}

                {/* Dịch vụ đã chọn */}
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="primary.main"
                  mb={1}
                >
                  Dịch vụ đã chọn
                </Typography>
                {selectedBooking.consultationData?.requestServices?.length >
                0 ? (
                  <Grid container spacing={1} mb={2}>
                    {selectedBooking.consultationData.requestServices.map(
                      (sv, idx) => (
                        <Grid item xs={12} sm={6} key={sv.serviceId || idx}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, bgcolor: "background.default" }}
                          >
                            <Typography
                              fontWeight={600}
                              noWrap
                              sx={{ textOverflow: "ellipsis" }}
                            >
                              {sv.serviceId?.serviceName ||
                                sv.serviceId?.name ||
                                sv.serviceName ||
                                sv.name ||
                                "Dịch vụ"}{" "}
                              (x{sv.quantity || sv.serviceQuantity || 1})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Giá dịch vụ:{" "}
                              {sv.serviceId?.price?.toLocaleString("vi-VN") ||
                                sv.servicePrice?.toLocaleString("vi-VN") ||
                                "-"}
                              ₫
                            </Typography>
                          </Paper>
                        </Grid>
                      )
                    )}
                  </Grid>
                ) : (
                  <Typography
                    color="text.secondary"
                    mb={2}
                    sx={{ fontStyle: "italic" }}
                  >
                    Không có dịch vụ được chọn
                  </Typography>
                )}
                {(() => {
                  let countdownText = null;
                  // pending_payment, consultation_requested
                  if (
                    ["pending_payment", "consultation_requested"].includes(
                      selectedBooking.status
                    )
                  ) {
                    countdownText =
                      "Tự động huỷ sau: " +
                      formatCountdown(countdowns[selectedBooking._id]);
                  }
                  // cancelled
                  else if (
                    selectedBooking.status === "cancelled" &&
                    selectedBooking.cancelledAt
                  ) {
                    const cd = countdowns[selectedBooking._id];
                    if (
                      cd &&
                      (cd.hours > 0 || cd.minutes > 0 || cd.seconds > 0)
                    ) {
                      countdownText = "Tự động xoá sau: " + formatCountdown(cd);
                    } else {
                      countdownText = "Đã hết hạn xoá";
                    }
                  }
                  // confirmed, confirmed_deposit
                  else if (
                    ["confirmed", "confirmed_deposit"].includes(
                      selectedBooking.status
                    )
                  ) {
                    const cd = countdowns[selectedBooking._id];
                    if (
                      cd &&
                      (cd.hours > 0 || cd.minutes > 0 || cd.seconds > 0)
                    ) {
                      countdownText =
                        "Có thể huỷ đến 24h trước khi bắt đầu lịch trình: " +
                        formatCountdown(cd);
                    } else {
                      countdownText = "Đã hết hạn huỷ";
                    }
                  }
                  return (
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600 }}
                      color="secondary"
                    >
                      {countdownText}
                    </Typography>
                  );
                })()}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDetail}
              variant="contained"
              color="primary"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
