import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Check,
  AlertCircle,
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Home,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import {
  customerCancelBooking,
  customerConfirmConsultation,
  fetchSchedulesOnly,
} from "../../../redux/asyncActions/bookingAsyncActions";
import { formatPrice } from "../../../redux/validation";
import Swal from "sweetalert2";

import {
  closeConfirmationModal,
  openTransactionModal,
} from "../../../redux/actions";
import { getScheduleById } from "../../../utils/scheduleHelpers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Stack,
  useTheme,
  Paper,
} from "@mui/material";

const ConfirmationModal = ({ scheduleObj }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { showConfirmationModal, confirmationData } = useSelector(
    (state) => state.ui.modals
  );
  const { submitting } = useSelector((state) => state.booking);
  const schedules = useSelector((state) => state.booking.schedules);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (
      confirmationData?.yachtId &&
      (!schedules || Object.keys(schedules).length === 0)
    ) {
      dispatch(fetchSchedulesOnly(confirmationData.yachtId));
    }
  }, [confirmationData?.yachtId, schedules, dispatch]);

  if (!showConfirmationModal || !confirmationData) return null;
  const { bookingId, isDirectBooking } = confirmationData;

  const adults = Number(
    confirmationData.adults ?? confirmationData.guestCounter?.adults ?? 1
  );
  const childrenUnder10 = Number(
    confirmationData.childrenUnder10 ??
      confirmationData.guestCounter?.childrenUnder10 ??
      0
  );
  const childrenAbove10 = Number(
    confirmationData.childrenAbove10 ??
      confirmationData.guestCounter?.childrenAbove10 ??
      0
  );
  const totalGuests = adults + Math.floor(childrenAbove10 / 2);

  const handleProceedToPayment = () => {
    if (!bookingId) {
      Swal.fire({
        icon: "error",
        title: "Thiếu booking ID",
        confirmButtonColor: theme.palette.primary.main,
      });
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      dispatch(closeConfirmationModal());
      dispatch(openTransactionModal(bookingId));
      setShowSuccess(false);
    }, 1500);
  };

  const handleConfirmAfterConsultation = async () => {
    if (!bookingId) {
      Swal.fire("Lỗi!", "Thiếu bookingId để xác nhận.", "error");
      return;
    }
    setShowSuccess(true);
    await dispatch(customerConfirmConsultation(bookingId));
    setTimeout(() => {
      dispatch(closeConfirmationModal());
      setShowSuccess(false);
    }, 1500);
  };

  const handleCancelOrReject = async () => {
    if (!bookingId) {
      dispatch(closeConfirmationModal());
      Swal.fire({ icon: "info", title: "Đã hủy", timer: 1500 });
      return;
    }
    await dispatch(customerCancelBooking(bookingId));
  };

  const confirmAction = isDirectBooking
    ? handleProceedToPayment
    : handleConfirmAfterConsultation;
  const confirmText = isDirectBooking
    ? "Tiến hành thanh toán"
    : "Xác nhận & Thanh toán";

  let scheduleText = "-";
  let schedule = scheduleObj;
  if (!schedule) {
    schedule = confirmationData.schedule || confirmationData.scheduleObj;
  }
  if (!schedule && confirmationData.scheduleId && schedules) {
    const yachtSchedules =
      confirmationData.yachtId && schedules[confirmationData.yachtId]
        ? schedules[confirmationData.yachtId]
        : schedules;
    schedule = getScheduleById(yachtSchedules, confirmationData.scheduleId);
  }
  if (schedule) {
    if (schedule.displayText) {
      scheduleText = schedule.displayText;
    } else if (schedule.startDate && schedule.endDate) {
      scheduleText = `${new Date(schedule.startDate).toLocaleDateString(
        "vi-VN"
      )} - ${new Date(schedule.endDate).toLocaleDateString("vi-VN")}`;
    } else if (schedule.scheduleId?.startDate && schedule.scheduleId?.endDate) {
      scheduleText = `${new Date(
        schedule.scheduleId.startDate
      ).toLocaleDateString("vi-VN")} - ${new Date(
        schedule.scheduleId.endDate
      ).toLocaleDateString("vi-VN")}`;
    }
  } else if (confirmationData.scheduleInfo) {
    scheduleText = confirmationData.scheduleInfo;
  }

  return (
    <Dialog
      open={showConfirmationModal}
      onClose={handleCancelOrReject}
      maxWidth="md"
      fullWidth
      sx={{ borderRadius: theme.shape.borderRadius * 2 }}
      PaperProps={{
        sx: {
          borderRadius: theme.shape.borderRadius * 2,
          overflow: "visible",
        },
      }}
    >
      {showSuccess && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.4)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: theme.spacing(6),
              borderRadius: theme.shape.borderRadius * 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Check
              size={64}
              color={theme.palette.success.main}
              style={{ marginBottom: theme.spacing(2) }}
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              color={theme.palette.success.dark}
              mb={1}
            >
              Thành công!
            </Typography>
            <Typography color={theme.palette.success.dark}>
              Đặt phòng của bạn đã được xác nhận.
            </Typography>
          </Paper>
        </Box>
      )}
      <DialogTitle
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: theme.palette.primary.contrastText,
          pb: theme.spacing(2),
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" fontWeight="bold">
              Xác nhận thông tin đặt phòng
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleCancelOrReject}
              sx={{ color: theme.palette.primary.contrastText }}
              disabled={submitting}
            >
              <X size={24} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent
        sx={{
          px: theme.spacing(4),
          py: theme.spacing(3),
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(90deg, ${
              theme.palette.warning.dark
            }, ${theme.palette.warning.lighter || "#fff7ed"})`,
            borderLeft: `4px solid ${theme.palette.warning.light}`,
            borderRadius: theme.shape.borderRadius,
            p: theme.spacing(2),
            my: theme.spacing(2),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <AlertCircle color={theme.palette.text.primary} size={20} />
            <Typography fontWeight={500} color={theme.palette.text.primary}>
              Thông tin này sẽ được sử dụng để xử lý đặt phòng của bạn
            </Typography>
          </Stack>
        </Box>
        <Grid container spacing={4} mb={4}>
          {/* Personal Info */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <User
                size={20}
                style={{
                  marginRight: theme.spacing(1),
                  color: theme.palette.primary.dark,
                }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color={theme.palette.text.primary}
              >
                Thông tin cá nhân
              </Typography>
            </Box>
            <Stack spacing={2}>
              {[
                {
                  icon: (
                    <User
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                  ),
                  label: "Họ và tên",
                  value: confirmationData.fullName,
                },
                {
                  icon: (
                    <Mail
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                  ),
                  label: "Email",
                  value: confirmationData.email,
                },
                {
                  icon: (
                    <Phone
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                  ),
                  label: "Số điện thoại",
                  value: confirmationData.phoneNumber,
                },
              ].map((item, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: theme.spacing(2),
                    px: theme.spacing(3),
                    borderRadius: theme.shape.borderRadius * 0.5,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {item.icon}
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.dark}
                      fontWeight={500}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography
                    color={theme.palette.text.primary}
                    fontWeight={500}
                  >
                    {item.value}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Grid>
          {/* Booking Info */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Calendar
                size={20}
                style={{
                  marginRight: theme.spacing(1),
                  color: theme.palette.primary.dark,
                }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color={theme.palette.text.primary}
              >
                Thông tin đặt phòng
              </Typography>
            </Box>
            <Stack spacing={2}>
              {[
                {
                  icon: (
                    <Users
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                  ),
                  label: "Số khách",
                  value: `${totalGuests} khách (${adults} người lớn${
                    childrenUnder10
                      ? `, ${childrenUnder10} trẻ em dưới 10 tuổi`
                      : ""
                  }${
                    childrenAbove10
                      ? `, ${childrenAbove10} trẻ em từ 10 tuổi`
                      : ""
                  })`,
                },
                {
                  icon: (
                    <Calendar
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                  ),
                  label: "Lịch trình",
                  value: scheduleText,
                },
              ].map((item, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: theme.spacing(2),
                    px: theme.spacing(3),
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {item.icon}
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.dark}
                      fontWeight={500}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography
                    color={theme.palette.text.primary}
                    fontWeight={500}
                  >
                    {item.value}
                  </Typography>
                </Paper>
              ))}
              {confirmationData.selectedRooms?.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: theme.spacing(2),
                    px: theme.spacing(3),
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Home
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.dark}
                      fontWeight={500}
                    >
                      Phòng đã chọn
                    </Typography>
                  </Box>
                  <Stack spacing={1} sx={{ maxHeight: 80, overflowY: "auto" }}>
                    {confirmationData.selectedRooms.map((room, i) => (
                      <Box
                        key={i}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bgcolor={theme.palette.background.paper}
                        borderRadius={theme.shape.borderRadius / 2}
                        px={2}
                      >
                        <Typography fontWeight={500}>
                          {room.roomName} × {room.roomQuantity}
                        </Typography>
                        <Typography
                          color={theme.palette.primary.main}
                          fontWeight={600}
                        >
                          {formatPrice(room.roomPrice * room.roomQuantity)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}
              {confirmationData.selectedServices?.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: theme.spacing(2),
                    px: theme.spacing(3),
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <Box display="flex" alignItems="center" pb={1}>
                    <Users
                      size={16}
                      style={{
                        marginRight: theme.spacing(0.5),
                        color: theme.palette.primary.dark,
                      }}
                    />
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.dark}
                      fontWeight={500}
                    >
                      Dịch vụ đã chọn
                    </Typography>
                  </Box>
                  <Stack spacing={1} sx={{ maxHeight: 80, overflowY: "auto" }}>
                    {confirmationData.selectedServices.map((service, i) => (
                      <Box
                        key={i}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bgcolor={theme.palette.background.paper}
                        borderRadius={theme.shape.borderRadius / 2}
                        px={2}
                      >
                        <Typography fontWeight={500}>
                          {service.serviceName}
                          {service.quantity ? ` × ${service.quantity}` : ""}
                        </Typography>
                        <Typography
                          color={theme.palette.primary.main}
                          fontWeight={600}
                        >
                          {formatPrice(
                            service.servicePrice *
                              (service.serviceQuantity || 1)
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
        {(confirmationData.consultationData?.requirements ||
          confirmationData.requirements) && (
          <Paper
            variant="outlined"
            sx={{
              mb: theme.spacing(4),
              bgcolor: theme.palette.primary.light,
              borderRadius: theme.shape.borderRadius,
              p: theme.spacing(2),
              borderColor: theme.palette.primary.main,
            }}
          >
            <Box display="flex" alignItems="center">
              <MessageSquare
                size={16}
                style={{
                  marginRight: theme.spacing(0.5),
                  color: theme.palette.primary.dark,
                }}
              />
              <Typography
                variant="caption"
                color={theme.palette.primary.dark}
                fontWeight={500}
              >
                Yêu cầu đặc biệt
              </Typography>
            </Box>
            <Box pl={2}>
              <Typography color={theme.palette.text.primary}>
                <li>
                  {confirmationData.consultationData?.requirements ||
                    confirmationData.requirements}
                </li>
              </Typography>
            </Box>
          </Paper>
        )}
        <Paper
          variant="outlined"
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.background.paper})`,
            borderColor: theme.palette.primary.main,
            borderRadius: theme.shape.borderRadius * 1.5,
            p: theme.spacing(3),
            mb: theme.spacing(4),
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <DollarSign
                color={theme.palette.primary.dark}
                style={{ marginRight: theme.spacing(1) }}
                size={24}
              />
              <Typography fontWeight="bold" color={theme.palette.text.primary}>
                Tổng tiền thanh toán:
              </Typography>
            </Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              {formatPrice(confirmationData.totalPrice)}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: theme.palette.background.paper,
          px: theme.spacing(4),
          py: theme.spacing(3),
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={handleCancelOrReject}
              variant="outlined"
              color="error"
              fullWidth
              size="large"
              disabled={submitting}
              sx={{ borderRadius: theme.shape.borderRadius, fontWeight: 600 }}
            >
              Hủy bỏ
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={confirmAction}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={submitting}
              sx={{
                borderRadius: theme.shape.borderRadius,
                fontWeight: 600,
                position: "relative",
              }}
            >
              {submitting ? (
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    border: `2px solid ${theme.palette.primary.contrastText}`,
                    borderTop: `2px solid transparent`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    mx: "auto",
                  }}
                />
              ) : (
                confirmText
              )}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
