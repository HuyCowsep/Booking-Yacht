import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Download,
  FileText,
  Calendar,
  User,
  Ship,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  CreditCard,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Hash,
  DollarSign,
  Percent,
  Calculator,
} from "lucide-react";
import { formatPrice } from "../../../redux/validation";
import { closeInvoiceModal } from "../../../redux/actions/uiActions";
import { closeTransactionModal } from "../../../redux/actions/uiActions";
import { resetInvoiceState } from "../../../redux/actions/invoiceActions";
import {
  resetBookingForm,
  clearCurrentBookingDetail,
} from "../../../redux/actions/bookingActions";
import { clearQRCodeData } from "../../../redux/actions/paymentActions";
import { downloadInvoicePDF } from "../../../redux/asyncActions/invoiceAsyncActions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Stack,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

function getScheduleText(schedule) {
  // Nếu scheduleId là object đã populate
  const s = schedule.scheduleId;
  if (!s || !s.startDate || !s.endDate) return "-";
  const start = new Date(s.startDate);
  const end = new Date(s.endDate);
  if (isNaN(start) || isNaN(end)) return "-";
  // Số ngày = số ngày thực tế (tính cả ngày bắt đầu và kết thúc)
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round((end - start) / msPerDay) + 1;
  const nights = days - 1;
  return `${days} ngày ${nights} đêm`;
}

const InvoiceModal = () => {
  const dispatch = useDispatch();
  const { showInvoiceModal, invoiceData } = useSelector(
    (state) => state.ui.modals
  );

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Thêm state lưu ngày mở modal
  const [openedDate] = React.useState(() => new Date());

  if (!showInvoiceModal || !invoiceData) return null;

  const handleCloseModal = () => {
    dispatch(closeInvoiceModal());
    dispatch(closeTransactionModal());
    dispatch(resetInvoiceState());
    dispatch(resetBookingForm());
    dispatch(clearQRCodeData());
    dispatch(clearCurrentBookingDetail());
  };

  const handleDownloadPDF = () => {
    dispatch(downloadInvoicePDF(invoiceData._id));
  };

  // Tính lại giá thực tế cho từng item
  const itemsWithRealPrice =
    invoiceData.items?.map((item) => {
      const roomObj =
        invoiceData.bookingId?.consultationData?.requestedRooms?.find(
          (r) => String(r.roomId && r.roomId._id) === String(item.itemId)
        );
      const serviceObj =
        invoiceData.bookingId?.consultationData?.requestServices?.find(
          (s) => String(s.serviceId && s.serviceId._id) === String(item.itemId)
        );
      const unitPrice =
        item.type === "room"
          ? roomObj?.roomId?.roomTypeId?.price ?? item.unitPrice
          : item.type === "service"
          ? serviceObj?.serviceId?.price ?? item.unitPrice
          : item.unitPrice;
      const totalPrice = unitPrice * item.quantity;
      return { ...item, unitPrice, totalPrice };
    }) || [];

  // Tính lại các trường tổng
  const subtotal = itemsWithRealPrice.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const discount = invoiceData.financials?.totalDiscount ?? 0;
  const amountBeforeTax = subtotal - discount;
  const tax = amountBeforeTax * 0.05;
  const total = amountBeforeTax + tax;
  const paidAmount = invoiceData.financials?.paidAmount ?? 0;
  const remainingAmount = total - paidAmount;

  // Helper to get customer address
  const getCustomerAddress = () => {
    if (invoiceData.bookingId?.customer?.address) {
      return invoiceData.bookingId.customer.address;
    }
    if (invoiceData.customerId?.address) {
      return invoiceData.customerId.address;
    }
    return "Phường Cầu Giấy - Hà Nội";
  };
  invoiceData.items?.forEach((item, idx) => {
    if (item.type === "room") {
      invoiceData.bookingId?.consultationData?.requestedRooms?.forEach(
        (r, i) => {}
      );
      const roomName =
        invoiceData.bookingId?.consultationData?.requestedRooms?.find(
          (r) => String(r.roomId && r.roomId._id) === String(item.itemId)
        )?.name;
    }
    if (item.type === "service") {
      invoiceData.bookingId?.consultationData?.requestServices?.forEach(
        (s, i) => {}
      );
      const serviceName =
        invoiceData.bookingId?.consultationData?.requestServices?.find(
          (s) => String(s.serviceId && s.serviceId._id) === String(item.itemId)
        )?.serviceName;
    }
  });

  return (
    <Dialog
      open={showInvoiceModal}
      onClose={handleCloseModal}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: theme.shape.borderRadius * 0.3,
          boxShadow: theme.shadows[2],
          background: theme.palette.background.paper,
          position: "relative",
          zIndex: 9999,
          maxHeight: fullScreen ? "100vh" : "90vh",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
          zIndex: 9998,
        },
      }}
      aria-labelledby="invoice-dialog-title"
      sx={{
        zIndex: 9999,
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        id="invoice-dialog-title"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              background: "rgba(255,255,255,0.15)",
              p: 1,
              borderRadius: theme.shape.borderRadius,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Receipt
              className="w-6 h-6"
              color={theme.palette.primary.contrastText}
            />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              fontFamily={theme.typography.fontFamily}
            >
              Hóa đơn thanh toán
            </Typography>
            <Typography
              variant="subtitle2"
              fontFamily={theme.typography.fontFamily}
            >
              Hóa đơn điện tử
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={handleCloseModal}
          sx={{
            color: theme.palette.primary.contrastText,
            ml: 2,
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
          aria-label="Đóng"
        >
          <X size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          background: theme.palette.background.default,
          px: { xs: 1, sm: 3 },
          py: { xs: 2, sm: 3 },
          maxHeight: fullScreen ? "calc(100vh - 120px)" : "calc(90vh - 120px)",
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
            "&:hover": {
              background: "#a8a8a8",
            },
          },
        }}
      >
        {/* Thông tin định danh hóa đơn */}
        <Box
          mb={3}
          p={2}
          sx={{
            bgcolor: theme.palette.background.paper,
            borderLeft: `8px solid ${theme.palette.primary.main}`,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Hash
                  className="w-4 h-4"
                  color={theme.palette.text.secondary}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Ký hiệu hóa đơn
                  </Typography>
                  <Typography
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    AB/20E
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FileText
                  className="w-4 h-4"
                  color={theme.palette.text.secondary}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Số hóa đơn
                  </Typography>
                  <Typography
                    fontWeight={600}
                    color={theme.palette.primary.main}
                  >
                    {invoiceData.invoiceNumber}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Calendar
                  className="w-4 h-4"
                  color={theme.palette.text.secondary}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Ngày phát hành
                  </Typography>
                  <Typography
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    {openedDate.toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {/* Thông tin người bán & người mua */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} lg={7}>
            <Box
              bgcolor={theme.palette.background.paper}
              border={2}
              borderColor={theme.palette.primary.main}
              borderRadius={theme.shape.borderRadius * 0.3}
              px={3}
              py={2}
              boxShadow={theme.shadows[1]}
              sx={{ minHeight: 180 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={2}
                pb={1}
                borderBottom={1}
                borderColor={theme.palette.divider}
              >
                <Building2
                  className="w-6 h-5"
                  color={theme.palette.primary.main}
                />
                <Typography
                  fontWeight={800}
                  color={theme.palette.primary.main}
                  textTransform="uppercase"
                  fontSize={18}
                  letterSpacing={1}
                >
                  THÔNG TIN NGƯỜI CHO THUÊ
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Building2
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.main}
                      fontWeight={700}
                    >
                      Tên công ty:
                    </Typography>
                    <Typography
                      fontWeight={700}
                      color={theme.palette.text.primary}
                    >
                      CÔNG TY DU THUYỀN LONGWARE
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MapPin
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color={theme.palette.text.secondary}
                    >
                      Địa chỉ:
                    </Typography>
                    <Typography color={theme.palette.text.primary}>
                      {" "}
                      Khu công nghệ cao, Hòa lạc, Thạch Thất, Hà Nội
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Hash
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color={theme.palette.text.secondary}
                    >
                      Mã số thuế:
                    </Typography>
                    <Typography fontWeight={600} color="error.main">
                      0123456789
                    </Typography>
                  </Box>
                </Stack>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone
                        className="w-4 h-4"
                        color={theme.palette.text.secondary}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.text.secondary}
                        >
                          Điện thoại:
                        </Typography>
                        <Typography color={theme.palette.text.primary}>
                          0123-456-789
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Mail
                        className="w-4 h-4"
                        color={theme.palette.text.secondary}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.text.secondary}
                        >
                          Email:
                        </Typography>
                        <Typography
                          sx={{ wordBreak: "break-all" }}
                          color={theme.palette.text.primary}
                        >
                          longwareBooking@yacht.com
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Globe
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color={theme.palette.text.secondary}
                    >
                      Website:
                    </Typography>
                    <Typography color={theme.palette.primary.main}>
                      www.longware.com
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Box
              bgcolor={theme.palette.background.paper}
              border={2}
              borderColor={theme.palette.purple?.main || "#22c55e"}
              borderRadius={theme.shape.borderRadius * 0.3}
              px={3}
              py={2}
              boxShadow={theme.shadows[1]}
              sx={{ minHeight: 180 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={2}
                pb={1}
                borderBottom={1}
                borderColor={theme.palette.divider}
              >
                <User
                  className="w-5 h-5"
                  color={theme.palette.purple?.main || "#22c55e"}
                />
                <Typography
                  fontWeight={800}
                  color={theme.palette.purple?.main || "#22c55e"}
                  fontSize={18}
                  letterSpacing={1}
                >
                  THÔNG TIN NGƯỜI THUÊ
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <User
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color={theme.palette.purple?.main || "#22c55e"}
                      fontWeight={700}
                    >
                      Họ và tên:
                    </Typography>
                    <Typography
                      fontWeight={700}
                      color={theme.palette.text.primary}
                    >
                      {invoiceData?.customerId?.fullName || "-"}
                    </Typography>
                  </Box>
                </Stack>
                {getCustomerAddress() && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MapPin
                      className="w-4 h-4"
                      color={theme.palette.text.secondary}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        color={theme.palette.text.secondary}
                      >
                        Địa chỉ:
                      </Typography>
                      <Typography color={theme.palette.text.primary}>
                        {getCustomerAddress()}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone
                        className="w-4 h-4"
                        color={theme.palette.text.secondary}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.text.secondary}
                        >
                          Số điện thoại:
                        </Typography>
                        <Typography color={theme.palette.text.primary}>
                          {invoiceData?.customerId?.phoneNumber}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Mail
                        className="w-4 h-4"
                        color={theme.palette.text.secondary}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.text.secondary}
                        >
                          Email:
                        </Typography>
                        <Typography
                          sx={{ wordBreak: "break-all" }}
                          color={theme.palette.text.primary}
                        >
                          {invoiceData.customerId?.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        {/* Thông tin dịch vụ */}
        {invoiceData.yachtInfo ||
          (invoiceData.yachtId && (
            <Box
              mb={3}
              p={2}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: theme.shape.borderRadius * 0.2,
                boxShadow: theme.shadows[1],
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={1}
                pb={1}
                borderBottom={1}
                borderColor={theme.palette.divider}
              >
                <Ship className="w-6 h-5" color={theme.palette.primary.main} />
                <Typography
                  fontWeight={700}
                  color={theme.palette.primary.main}
                  fontSize={16}
                >
                  Thông tin dịch vụ
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {invoiceData.yachtId.name && (
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Ship
                        className="w-4 h-4"
                        color={theme.palette.primary.main}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.primary.main}
                        >
                          Du thuyền
                        </Typography>
                        <Typography
                          fontWeight={600}
                          color={theme.palette.text.primary}
                        >
                          {invoiceData.yachtId.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                )}
                {invoiceData.bookingId.yacht.locationId.name && (
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <MapPin
                        className="w-4 h-4"
                        color={theme.palette.primary.main}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.primary.main}
                        >
                          Địa điểm
                        </Typography>
                        <Typography color={theme.palette.text.primary}>
                          {invoiceData.bookingId.yacht.locationId.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                )}

                {invoiceData.bookingId.checkInDate && (
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Calendar
                        className="w-4 h-4"
                        color={theme.palette.primary.main}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.primary.main}
                        >
                          Ngày nhận phòng
                        </Typography>
                        <Typography color={theme.palette.text.primary}>
                          {new Date(
                            invoiceData.bookingId.checkInDate
                          ).toLocaleDateString("vi-VN")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                )}
                {invoiceData.bookingId.checkOutDate && (
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Calendar
                        className="w-4 h-4"
                        color={theme.palette.primary.main}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color={theme.palette.primary.main}
                        >
                          Ngày trả phòng
                        </Typography>
                        <Typography color={theme.palette.text.primary}>
                          {new Date(
                            invoiceData.bookingId.checkOutDate
                          ).toLocaleDateString("vi-VN")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                )}
              </Grid>
              {/* Số khách */}
              {invoiceData.bookingId.guestCount && (
                <Box mt={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <User
                      className="w-4 h-4"
                      color={theme.palette.primary.main}
                    />
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.main}
                      fontWeight={600}
                    >
                      Số khách:
                    </Typography>
                    <Typography
                      fontWeight={700}
                      color={theme.palette.text.primary}
                    >
                      {invoiceData.bookingId.adults || 0} người lớn
                      {typeof invoiceData.bookingId.childrenUnder10 === "number"
                        ? `, ${invoiceData.bookingId.childrenUnder10} trẻ em dưới 10 tuổi`
                        : ""}
                      {typeof invoiceData.bookingId.childrenAbove10 === "number"
                        ? `, ${invoiceData.bookingId.childrenAbove10} trẻ em từ 10 tuổi`
                        : ""}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                    ml={4}
                  >
                    Tổng khách quy đổi:{" "}
                    {invoiceData.bookingId.adults +
                      Math.floor(
                        (invoiceData.bookingId.childrenAbove10 || 0) / 2
                      )}{" "}
                    (2 trẻ em từ 10 tuổi = 1 người lớn, trẻ em dưới 10 tuổi
                    không tính)
                  </Typography>
                </Box>
              )}
              <Grid item xs={12} md={6}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Calendar
                    className="w-4 h-4"
                    color={theme.palette.primary.main}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.main}
                    >
                      Lịch trình
                    </Typography>
                    <Typography
                      fontWeight={600}
                      color={theme.palette.text.primary}
                    >
                      {getScheduleText(invoiceData.bookingId?.schedule)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Box>
          ))}
        {/* Bảng chi tiết dịch vụ */}
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Receipt className="w-5 h-5" color={theme.palette.text.secondary} />
            <Typography
              fontWeight={700}
              color={theme.palette.text.primary}
              fontSize={18}
            >
              Chi tiết phòng và dịch vụ{" "}
            </Typography>
          </Stack>
          <Box
            sx={{
              overflowX: "auto",
              borderRadius: theme.shape.borderRadius * 0.2,
              border: `1px solid ${theme.palette.primary.main}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <table
              style={{
                width: "100%",
                background: theme.palette.background.paper,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}25 100%)`,
                  }}
                >
                  <th
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      padding: 12,
                      textAlign: "left",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: 14,
                    }}
                  >
                    STT
                  </th>
                  <th
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      padding: 12,
                      textAlign: "left",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: 14,
                    }}
                  >
                    Tên phòng, dịch vụ
                  </th>
                  <th
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      padding: 12,
                      textAlign: "center",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: 14,
                    }}
                  >
                    Đơn vị tính
                  </th>
                  <th
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      padding: 12,
                      textAlign: "center",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: 14,
                    }}
                  >
                    Số lượng
                  </th>
                  <th
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      padding: 12,
                      textAlign: "right",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: 14,
                    }}
                  >
                    Đơn giá
                  </th>
                  <th
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                      padding: 12,
                      textAlign: "right",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: 14,
                    }}
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemsWithRealPrice.map((item, index) => {
                  const roomObj =
                    invoiceData.bookingId?.consultationData?.requestedRooms?.find(
                      (r) =>
                        String(r.roomId && r.roomId._id) === String(item.itemId)
                    );
                  const serviceObj =
                    invoiceData.bookingId?.consultationData?.requestServices?.find(
                      (s) =>
                        String(s.serviceId && s.serviceId._id) ===
                        String(item.itemId)
                    );
                  const unitPrice = item.unitPrice;
                  const totalPrice = item.totalPrice;
                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        background:
                          index % 2 === 0
                            ? theme.palette.background.paper
                            : theme.palette.background.default,
                      }}
                    >
                      <td
                        style={{
                          padding: 12,
                          textAlign: "center",
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {index + 1}
                      </td>
                      <td style={{ padding: 12 }}>
                        <Typography
                          fontWeight={600}
                          color={theme.palette.text.primary}
                        >
                          {item.type === "room"
                            ? roomObj?.roomId?.name ||
                              item.displayName ||
                              item.name
                            : item.type === "service"
                            ? serviceObj?.serviceId?.serviceName ||
                              item.displayName ||
                              item.name
                            : item.name}
                        </Typography>
                        {item.description && (
                          <Typography
                            variant="caption"
                            color={theme.palette.text.secondary}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          textAlign: "center",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {item.type === "room"
                          ? "Phòng"
                          : item.type === "service"
                          ? "Người"
                          : ""}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          textAlign: "center",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          textAlign: "right",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {formatPrice(unitPrice)}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          textAlign: "right",
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {formatPrice(totalPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Box>
        {/* Tổng tiền */}
        <Box mb={3} display="flex" justifyContent="end">
          <Box
            width="100%"
            maxWidth={400}
            boxShadow={theme.shadows[2]}
            border={1}
            borderColor={theme.palette.primary.main}
            borderRadius={theme.shape.borderRadius * 0.2}
            p={2}
            bgcolor={theme.palette.background.paper}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Calculator
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Typography color={theme.palette.text.secondary}>
                    Tổng tiền phòng và dịch vụ
                  </Typography>
                </Stack>
                <Typography fontWeight={600} color={theme.palette.text.primary}>
                  {formatPrice(subtotal)}
                </Typography>
              </Stack>
              {discount > 0 && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Percent className="w-4 h-4" color="error.main" />
                    <Typography color="error.main">
                      Chiết khấu thương mại
                    </Typography>
                  </Stack>
                  <Typography fontWeight={600} color="error.main">
                    -{formatPrice(discount)}
                  </Typography>
                </Stack>
              )}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DollarSign
                    className="w-4 h-4"
                    color={theme.palette.text.secondary}
                  />
                  <Typography color={theme.palette.text.secondary}>
                    Tiền chưa có thuế VAT
                  </Typography>
                </Stack>
                <Typography fontWeight={600} color={theme.palette.text.primary}>
                  {formatPrice(amountBeforeTax)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Percent
                    className="w-4 h-4"
                    color={theme.palette.primary.main}
                  />
                  <Typography color={theme.palette.text.secondary}>
                    Thuế VAT (5%)
                  </Typography>
                </Stack>
                <Typography fontWeight={600} color={theme.palette.primary.main}>
                  {formatPrice(tax)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Receipt
                    className="w-5 h-5"
                    color={theme.palette.primary.main}
                  />
                  <Typography
                    fontWeight={700}
                    color={theme.palette.text.primary}
                    fontSize={16}
                  >
                    TỔNG TIỀN THANH TOÁN
                  </Typography>
                </Stack>
                <Typography
                  fontWeight={700}
                  color={theme.palette.primary.main}
                  fontSize={20}
                >
                  {formatPrice(total)}
                </Typography>
              </Stack>
              <Box
                bgcolor={`${theme.palette.primary.main}15`}
                border={1}
                borderColor={theme.palette.primary.main}
                borderRadius={1}
                p={1.5}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircle
                      className="w-4 h-4"
                      color={theme.palette.primary.main}
                    />
                    <Typography
                      color={theme.palette.primary.main}
                      fontWeight={600}
                    >
                      Đã thanh toán
                    </Typography>
                  </Stack>
                  <Typography
                    fontWeight={700}
                    color={theme.palette.primary.main}
                  >
                    {formatPrice(paidAmount)}
                  </Typography>
                </Stack>
              </Box>
              {remainingAmount > 0 && (
                <Box
                  border={1}
                  borderColor={theme.palette.warning.dark}
                  borderRadius={1}
                  p={1.5}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AlertCircle
                        className="w-4 h-4"
                        color={theme.palette.warning.dark}
                      />
                      <Typography
                        color={theme.palette.warning.dark}
                        fontWeight={600}
                      >
                        Còn lại
                      </Typography>
                    </Stack>
                    <Typography
                      fontWeight={700}
                      color={theme.palette.warning.dark}
                    >
                      {formatPrice(remainingAmount)}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
        {/* Thông tin giao dịch */}
        <Box
          mb={3}
          bgcolor={`${theme.palette.primary.main}15`}
          border={1}
          borderColor={theme.palette.primary.main}
          borderRadius={theme.shape.borderRadius * 0.3}
          px={3}
          py={2}
          boxShadow={theme.shadows[1]}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mb={1}
            pb={1}
            borderBottom={1}
            borderColor={theme.palette.divider}
          >
            <CreditCard
              className="w-5 h-5"
              color={theme.palette.purple?.main || "#a21caf"}
            />
            <Typography
              fontWeight={700}
              color={theme.palette.text.primary}
              fontSize={18}
            >
              Thông tin thanh toán
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Receipt
                  className="w-4 h-4"
                  color={theme.palette.text.secondary}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Loại giao dịch
                  </Typography>
                  <Typography
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    {invoiceData.transactionId?.transaction_type === "deposit"
                      ? "Thanh toán cọc"
                      : "Thanh toán đầy đủ"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Hash
                  className="w-4 h-4"
                  color={theme.palette.text.secondary}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Mã giao dịch
                  </Typography>
                  <Typography
                    fontFamily="monospace"
                    fontSize={14}
                    color={theme.palette.text.primary}
                  >
                    {invoiceData.transactionId?.transaction_reference}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle
                  className="w-4 h-4"
                  color={theme.palette.primary.main}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Trạng thái
                  </Typography>
                  <Typography
                    fontWeight={600}
                    color={theme.palette.success.main}
                  >
                    Thành công
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Clock
                  className="w-4 h-4"
                  color={theme.palette.text.secondary}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                  >
                    Thời gian thanh toán
                  </Typography>
                  <Typography fontSize={14} color={theme.palette.text.primary}>
                    {invoiceData.transactionId?.transactionDate
                      ? new Date(
                          invoiceData.transactionId.transactionDate
                        ).toLocaleString("vi-VN")
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {/* Ghi chú */}
        {invoiceData.notes && (
          <Box
            mb={3}
            bgcolor="warning.light"
            border={1}
            borderColor="warning.main"
            borderRadius={theme.shape.borderRadius}
            p={3}
            boxShadow={theme.shadows[1]}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <FileText className="w-5 h-5" color="warning.main" />
              <Typography fontWeight={700} color="warning.main">
                Ghi chú
              </Typography>
            </Stack>
            <Typography color="warning.main">{invoiceData.notes}</Typography>
          </Box>
        )}
        {/* Chữ ký điện tử */}
        <Grid container spacing={4} pt={2} borderColor={theme.palette.divider}>
          <Grid item xs={12} md={6} textAlign="center">
            <Typography
              fontWeight={700}
              color={theme.palette.text.primary}
              mb={0.5}
            >
              NGƯỜI THUÊ
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              mb={2}
            >
              (Ký, ghi rõ họ tên)
            </Typography>
            <Box
              height={48}
              borderBottom={1}
              borderColor={theme.palette.divider}
              width="30%"
              mx="auto"
              mb={1}
            ></Box>
            <Typography fontWeight={600} color={theme.palette.text.primary}>
              {invoiceData.customerId.fullName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} textAlign="center">
            <Typography
              fontWeight={700}
              color={theme.palette.text.primary}
              mb={0.5}
            >
              NGƯỜI CHO THUÊ
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              mb={2}
            >
              (Ký, đóng dấu, ghi rõ họ tên)
            </Typography>
            <Box
              height={48}
              borderBottom={1}
              borderColor={theme.palette.divider}
              width="30%"
              mx="auto"
              mb={1}
            ></Box>
            <Typography fontWeight={600} color={theme.palette.text.primary}>
              Công ty TNHH Du thuyền Longware
            </Typography>
          </Grid>
        </Grid>
        {/* Footer cảm ơn */}
        <Box
          textAlign="center"
          pt={3}
          mt={3}
          borderTop={1}
          borderColor={theme.palette.divider.main}
        >
          <Box
            bgcolor={`linear-gradient(90deg, ${
              theme.palette.purple?.main || "#c026d3"
            } 0%, ${theme.palette.purple?.dark || "#db2777"} 100%)`}
            color={theme.palette.purple?.contrastText || "#fff"}
            boxShadow={theme.shadows[2]}
            borderRadius={theme.shape.borderRadius * 0.3}
            p={2}
            border={1}
            borderColor={theme.palette.primary.main}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              mb={1}
            >
              <CheckCircle
                className="w-6 h-6"
                color={theme.palette.primary.main || "#fff"}
              />
              <Typography
                fontWeight={700}
                color={theme.palette.primary.main || "#fff"}
                fontSize={20}
              >
                Cảm ơn quý khách!
              </Typography>
            </Stack>
            <Typography color={theme.palette.primary.main || "#fff"}>
              Chúng tôi hy vọng được phục vụ quý khách trong những chuyến đi
              tiếp theo.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: theme.palette.background.default,
          px: 3,
          py: 2,
          borderBottomLeftRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
          borderTop: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          startIcon={<Download size={18} />}
          sx={{
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[2],
            textTransform: "none",
          }}
        >
          Tải xuống PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceModal;
