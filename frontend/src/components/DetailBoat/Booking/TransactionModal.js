import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  CreditCard,
  Percent,
  QrCode,
  CheckCircle,
  Info,
  Banknote,
  Smartphone,
  Calendar,
  ArrowRight,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Building,
  Timer,
  Users,
  ChevronLeft,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tab,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  createDepositPayment,
  createFullPayment,
  simulatePaymentSuccess,
  stopPaymentStatusPolling,
  cancelTransaction,
} from "../../../redux/asyncActions/paymentAsyncActions";
import {
  fetchCustomerBookingDetail,
  fetchCustomerBookings,
} from "../../../redux/asyncActions/bookingAsyncActions";
import { fetchInvoiceByTransactionId } from "../../../redux/asyncActions/invoiceAsyncActions";
import { formatPrice } from "../../../redux/validation";
import {
  clearQRCodeData,
  closeTransactionModal,
  setActivePaymentTab,
} from "../../../redux/actions";
import Swal from "sweetalert2";
import { getScheduleById } from "../../../utils/scheduleHelpers";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 2,
    maxWidth: "1200px",
    width: "100%",
    height: "90vh",
    minHeight: "500px",
    margin: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      width: "95%",
      height: "95vh",
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  textAlign: "center",
  padding: theme.spacing(2, 3),
  "& .MuiTypography-root": {
    fontWeight: 700,
  },
}));

const BookingInfoCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  height: "70vh",
  overflowY: "auto",
  [theme.breakpoints.down("md")]: {
    height: "auto",
    maxHeight: "50vh",
  },
}));

const PaymentMethodCard = styled(Card)(({ theme, selected, disabled }) => ({
  cursor: disabled ? "not-allowed" : "pointer",
  border: `2px solid ${
    selected ? theme.palette.primary.main : theme.palette.divider
  }`,
  backgroundColor: selected
    ? theme.palette.primary.light + "20"
    : theme.palette.background.paper,
  transition: "all 0.2s ease-in-out",
  opacity: disabled ? 0.5 : 1,
  "&:hover": {
    transform: disabled ? "none" : "scale(1.02)",
    borderColor: disabled ? theme.palette.divider : theme.palette.primary.main,
    boxShadow: disabled ? theme.shadows[1] : theme.shadows[4],
  },
}));

const PaymentTab = styled(Tab)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  margin: theme.spacing(0.5),
  backgroundColor: active ? theme.palette.background.paper : "transparent",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  border: active ? `1px solid ${theme.palette.primary.main}` : "none",
  boxShadow: active ? theme.shadows[2] : "none",
  transform: active ? "scale(1.05)" : "scale(1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.background.paper
      : theme.palette.action.hover,
  },
}));

const PaymentButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  ...(variant === "deposit" && {
    background: `linear-gradient(135deg, #ff9800 0%, #f57c00 100%)`,
    "&:hover": {
      background: `linear-gradient(135deg, #f57c00 0%, #e65100 100%)`,
    },
  }),
  ...(variant === "full" && {
    background: `linear-gradient(135deg, #4caf50 0%, #388e3c 100%)`,
    "&:hover": {
      background: `linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)`,
    },
  }),
}));

const QRContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  color: theme.palette.primary.contrastText,
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const SuccessContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #4caf50 0%, #388e3c 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  color: "white",
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const InfoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}));

if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `.swal-archivo-font { font-family: 'Archivo', sans-serif !important; }`;
  document.head.appendChild(style);
}

const TransactionModal = ({ onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const { showTransactionModal, bookingIdFortransaction } = useSelector(
    (state) => state.ui.modals
  );
  const { activePaymentTab } = useSelector((state) => state.ui);
  const {
    currentBookingDetail,
    submitting: bookingSubmitting,
    error: bookingError,
  } = useSelector((state) => state.booking);
  const {
    qrCodeData,
    paymentStatus,
    loading: paymentLoading,
    isPolling,
  } = useSelector((state) => state.payment);
  const { confirmationData } = useSelector((state) => state.ui.modals);
  const schedules = useSelector((state) => state.booking.schedules);
  const booking = currentBookingDetail && currentBookingDetail.booking;
  const yachtId = booking?.yacht?._id || booking?.yacht;
  const schedulesForYacht = yachtId ? schedules[yachtId] || [] : [];
  const scheduleObj =
    booking &&
    booking.schedule &&
    typeof booking.schedule === "object" &&
    booking.schedule.displayText
      ? booking.schedule
      : getScheduleById(
          schedulesForYacht,
          booking?.schedule?._id || booking?.schedule
        );

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("bank_transfer");
  const [copiedText, setCopiedText] = useState("");
  const [showBankInfo, setShowBankInfo] = useState(true);
  const [randomQR, setRandomQR] = useState(null);

  useEffect(() => {
    if (showTransactionModal) {
      // setIsVisible(true); // This state is removed, so this line is removed.
      if (bookingIdFortransaction) {
        dispatch(fetchCustomerBookingDetail(bookingIdFortransaction));
      }
    }
    return () => {
      if (isPolling) {
        dispatch(stopPaymentStatusPolling());
      }
    };
  }, [showTransactionModal, bookingIdFortransaction, dispatch, isPolling]);

  useEffect(() => {
    console.log(
      "paymentStatus:",
      paymentStatus,
      "showTransactionModal:",
      showTransactionModal
    );
    if (
      (paymentStatus === "fully_paid" ||
        paymentStatus === "deposit_paid" ||
        paymentStatus === "completed") &&
      showTransactionModal
    ) {
      console.log("Trigger close modal after 2s");
      localStorage.removeItem("bookingIdForTransaction");
      setTimeout(() => {
        dispatch(closeTransactionModal());
        dispatch(clearQRCodeData());
        if (bookingIdFortransaction) {
          dispatch(fetchCustomerBookingDetail(bookingIdFortransaction));
        }
        dispatch(fetchCustomerBookings());
      }, 2000);
    }
  }, [paymentStatus, showTransactionModal]);

  useEffect(() => {
    if (showTransactionModal && bookingIdFortransaction) {
      localStorage.setItem("bookingIdForTransaction", bookingIdFortransaction);
    }
    // Nếu modal đóng hoặc bookingIdFortransaction không còn, xóa localStorage
    if (!showTransactionModal || !bookingIdFortransaction) {
      localStorage.removeItem("bookingIdForTransaction");
    }
  }, [showTransactionModal, bookingIdFortransaction]);

  // Reset randomQR khi có qrCodeData hoặc đóng modal
  useEffect(() => {
    if (qrCodeData || !showTransactionModal) {
      setRandomQR(null);
    }
  }, [qrCodeData, showTransactionModal]);

  // Hàm sinh QR ngẫu nhiên
  const generateRandomQR = (amount, bookingCode, method) => {
    // Chuỗi QR có thể là JSON hoặc text, ở đây dùng JSON
    const data = {
      type: "test",
      method,
      amount,
      bookingCode,
      time: Date.now(),
      random: Math.random().toString(36).substring(2, 10),
    };
    return JSON.stringify(data);
  };

  // Khi chọn phương thức thanh toán
  const handleSelectPaymentMethod = (method) => {
    if (!paymentLoading && !qrCodeData) {
      setSelectedPaymentMethod(method);
      // Sinh QR ngẫu nhiên tương ứng
      let amount =
        activePaymentTab === 0 ? amountForDepositTab : amountForFullTab;
      setRandomQR({
        qrData: generateRandomQR(amount, booking.bookingCode, method),
        amount,
        bookingCode: booking.bookingCode,
        method,
      });
    }
  };

  // Khi chuyển tab thanh toán
  const handleTabChange = (tabIndex) => {
    if (!paymentLoading && !qrCodeData) {
      dispatch(setActivePaymentTab(tabIndex));
      // Sinh QR ngẫu nhiên tương ứng
      let amount = tabIndex === 0 ? amountForDepositTab : amountForFullTab;
      setRandomQR({
        qrData: generateRandomQR(
          amount,
          booking.bookingCode,
          selectedPaymentMethod
        ),
        amount,
        bookingCode: booking.bookingCode,
        method: selectedPaymentMethod,
      });
    }
  };

  const handleClose = () => {
    console.log("handleClose called");
    dispatch({ type: "CLOSE_TRANSACTION_MODAL" });
    localStorage.removeItem("bookingIdForTransaction");
    // Nếu có các dispatch khác, log thêm
    setTimeout(() => {
      console.log("showTransactionModal after close:", showTransactionModal);
      console.log(
        "localStorage after close:",
        localStorage.getItem("bookingIdForTransaction")
      );
    }, 500);
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {}
  };
  // Hàm kiểm tra transaction pending (giả lập, cần thay bằng API thực tế nếu có)
  const getPendingTransactionIdForBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:9999/api/v1/payments/booking/${bookingId}/pending-transaction`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.data.transactionId : null;
    } catch {
      return null;
    }
  };

  const handleBackToChooseMethod = async () => {
    const pendingTransactionId = await getPendingTransactionIdForBooking(
      bookingIdFortransaction
    );
    if (pendingTransactionId) {
      Swal.fire({
        icon: "warning",
        title: "Bạn đang có giao dịch chưa hoàn tất",
        html: `
          <div style="text-align:center; font-family: 'Archivo', sans-serif;">
            <b>Chỉ có thể tạo một giao dịch thanh toán cho mỗi booking tại một thời điểm.</b><br/>
            <ul style="margin:8px 0 0 18px;padding:0;">
              <li>Chọn <b>Hủy</b> để tiếp tục thanh toán với phương thức cũ.</li>
              <li>Chọn <b>Tạo giao dịch mới</b> để hủy giao dịch cũ và chọn lại phương thức thanh toán.</li>
            </ul>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Hủy",
        cancelButtonText: "Tạo giao dịch mới",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({
            type: "OPEN_TRANSACTION_MODAL",
            payload: {
              bookingId: bookingIdFortransaction,
              transactionId: pendingTransactionId,
            },
          });
        } else {
          // Gọi API cancel transaction pending trước khi reset state
          const success = await dispatch(
            cancelTransaction(pendingTransactionId)
          );
          if (success) {
            setRandomQR(null);
            setShowBankInfo(true);
            Swal.fire({
              icon: "success",
              title: "Đã hủy giao dịch cũ!",
              text: "Bạn có thể chọn lại phương thức thanh toán và tạo giao dịch mới.",
              timer: 2000,
              showConfirmButton: false,
              customClass: { popup: "swal-archivo-font" },
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Không thể hủy giao dịch cũ!",
              text: "Vui lòng thử lại hoặc liên hệ hỗ trợ.",
              customClass: { popup: "swal-archivo-font" },
            });
          }
        }
      });
    } else {
      dispatch(clearQRCodeData());
      dispatch({ type: "CREATE_TRANSACTION_SUCCESS", payload: null });
      dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: "idle" });
      setRandomQR(null);
      setShowBankInfo(true);
      Swal.fire({
        icon: "info",
        title: "Không có giao dịch nào đang chờ",
        text: "Bạn có thể tạo giao dịch mới hoặc chọn phương thức thanh toán khác.",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "swal-archivo-font" },
      });
    }
  };

  // Nếu booking chưa có (null/undefined), không render modal hoặc render loading
  if (!bookingIdFortransaction) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300">
        <div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thiếu thông tin booking
              </h3>
              <p className="text-red-600 mb-6">
                Vui lòng chọn lại booking để thanh toán.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!booking) return null;

  // Error State
  if (bookingError) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300">
        <div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-red-600 mb-6">{bookingError}</p>
              <button
                onClick={handleClose}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (
    bookingSubmitting ||
    !currentBookingDetail ||
    (currentBookingDetail.booking &&
      currentBookingDetail.booking._id !== bookingIdFortransaction)
  ) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300">
        <div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đang tải thông tin
              </h3>
              <p className="text-gray-600 mb-4">
                Vui lòng chờ trong giây lát...
              </p>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = booking.paymentBreakdown?.totalAmount || 0;
  const depositAmountValue = booking.paymentBreakdown?.depositAmount || 0;
  const remainingAmountValue =
    booking.paymentBreakdown?.remainingAmount || totalAmount;
  const amountForDepositTab = depositAmountValue;
  const amountForFullTab =
    booking.paymentBreakdown?.totalPaid === 0
      ? totalAmount
      : remainingAmountValue;

  // Nếu thiếu childrenUnder10/childrenAbove10, lấy từ confirmationData
  const adults = Number(
    booking.guestCounter?.adults ??
      booking.adults ??
      confirmationData?.adults ??
      confirmationData?.guestCounter?.adults ??
      1
  );
  const childrenAbove10 =
    booking.guestCounter?.childrenAbove10 ??
    booking.childrenAbove10 ??
    confirmationData?.childrenAbove10 ??
    confirmationData?.guestCounter?.childrenAbove10 ??
    0;

  const totalGuests = adults + Math.floor(childrenAbove10 / 2);
  const bookedRooms = currentBookingDetail.bookedRooms || [];
  const totalRooms = bookedRooms.reduce((sum, r) => sum + (r.quantity || 0), 0);

  console.log("bookedRooms", bookedRooms);
  console.log("totalRooms", totalRooms);
  console.log("booking.roomCount", booking.roomCount);
  // Fallback cho số phòng nếu không có dữ liệu bookedRooms
  const displayTotalRooms =
    totalRooms > 0 ? totalRooms : booking.roomCount || 1;
  const displayBookedRooms =
    bookedRooms.length > 0
      ? bookedRooms
      : [{ name: "Phòng", quantity: displayTotalRooms }];

  const bookedServices =
    currentBookingDetail.bookedServices &&
    currentBookingDetail.bookedServices.length > 0
      ? currentBookingDetail.bookedServices
      : booking.consultationData.requestServices ||
        booking.consultationData.selectedServices ||
        [];
  const handleDepositPayment = async () => {
    if (!bookingIdFortransaction) return;
    dispatch(
      createDepositPayment(bookingIdFortransaction, selectedPaymentMethod)
    );
  };

  const handleFullOrRemainingPayment = async () => {
    if (!bookingIdFortransaction) return;
    dispatch(createFullPayment(bookingIdFortransaction, selectedPaymentMethod));
  };

  const handleSimulatePayment = () => {
    if (qrCodeData?.transactionId) {
      dispatch(simulatePaymentSuccess(qrCodeData.transactionId))
        .then(() => {
          if (bookingIdFortransaction) {
            dispatch(fetchCustomerBookingDetail(bookingIdFortransaction));
          }
          // Đóng modal sau khi mô phỏng thành công
          localStorage.removeItem("bookingIdForTransaction");
          dispatch(closeTransactionModal());
          dispatch(clearQRCodeData());
        })
        .catch((error) => {});
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "bank_transfer":
        return <Banknote className="w-5 h-5" />;
      case "vnpay":
        return <CreditCard className="w-5 h-5" />;
      case "momo":
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "fully_paid":
        return "text-green-600 bg-green-50";
      case "deposit_paid":
        return "text-yellow-600 bg-yellow-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "fully_paid":
        return "Đã thanh toán";
      case "deposit_paid":
        return "Đã đặt cọc";
      case "pending":
        return "Chờ thanh toán";
      default:
        return "Chưa thanh toán";
    }
  };

  const renderBookingInfo = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 mb-6 border border-blue-100">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-base  font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2  text-blue-600" />
          Thông tin booking
        </h3>
        <span
          className={`px-2 rounded-full bg-white border border-gray-600 text-xs font-medium ${getPaymentStatusColor(
            booking.paymentStatus
          )}`}
        >
          {getPaymentStatusText(booking.paymentStatus)}
        </span>
      </div>

      <div className="grid grid-cols-1 border-t border-blue-100 gap-2">
        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Mã booking
          </span>
          <span className="font-semibold text-gray-900">
            {booking.bookingCode}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Banknote className="w-4 h-4 mr-2" />
            Tổng tiền
          </span>
          <span className="font-bold text-lg text-blue-600">
            {formatPrice(totalAmount)}
          </span>
        </div>

        {booking.paymentBreakdown?.totalPaid > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-blue-100">
            <span className="text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Đã thanh toán
            </span>
            <span className="font-semibold text-green-600">
              {formatPrice(booking.paymentBreakdown.totalPaid)}
            </span>
          </div>
        )}

        {booking.paymentBreakdown?.depositAmount > 0 &&
          booking.paymentStatus !== "deposit_paid" &&
          booking.paymentStatus !== "fully_paid" && (
            <div className="flex items-center justify-between py-2 border-b border-blue-100">
              <span className="text-gray-600 flex items-center">
                <Percent className="w-4 h-4 mr-2" />
                Tiền cọc
              </span>
              <span className="font-semibold text-orange-600">
                {formatPrice(booking.paymentBreakdown.depositAmount)}
              </span>
            </div>
          )}

        {booking.paymentStatus === "deposit_paid" &&
          booking.paymentBreakdown?.remainingAmount > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                Còn lại
              </span>
              <span className="font-semibold text-red-600">
                {formatPrice(booking.paymentBreakdown.remainingAmount)}
              </span>
            </div>
          )}

        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Số khách
          </span>
          <span className="font-semibold text-gray-900">
            {totalGuests} khách
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Số phòng đặt
          </span>
          <span className="font-semibold text-gray-900">
            {totalRooms} phòng
          </span>
        </div>
        {bookedRooms.length > 0 && (
          <div className="py-2">
            <ul className="text-sm text-gray-700 list-disc ml-6">
              {bookedRooms.map((room, idx) => (
                <li key={room._id || room.roomId?._id || room.id || idx}>
                  {room.roomId?.name || room.name || "Phòng"} x {room.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Ngày đặt */}
        <div className="flex items-center justify-between py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Ngày đặt
          </span>
          <span className="font-semibold text-gray-900">
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString("vi-VN")
              : "-"}
          </span>
        </div>
        {/* Dịch vụ */}
        {bookedServices.length > 0 && (
          <div className="py-2">
            <span className="text-gray-600 flex items-center mb-1">
              <Info className="w-4 h-4 mr-2" />
              Dịch vụ đã chọn
            </span>
            <ul className="text-sm text-gray-700 list-disc ml-6">
              {bookedServices.map((service, idx) => (
                <li key={service._id || service.serviceId || service.id || idx}>
                  {service.serviceId?.serviceName ||
                    service.serviceId?.name ||
                    service.name ||
                    service.serviceName ||
                    "Dịch vụ"}
                  {` x${service.quantity || service.serviceQuantity || 1}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-start py-2 border-b border-blue-100">
          <span className="text-gray-600 flex items-center min-w-[90px]">
            <Calendar className="w-4 h-4 mr-2" />
            Lịch trình
          </span>
          <span className="font-semibold text-gray-900 break-words text-right flex-1">
            {scheduleObj?.displayText ||
              (scheduleObj?.scheduleId?.startDate &&
              scheduleObj?.scheduleId?.endDate
                ? `${new Date(
                    scheduleObj.scheduleId.startDate
                  ).toLocaleDateString("vi-VN")} - ${new Date(
                    scheduleObj.scheduleId.endDate
                  ).toLocaleDateString("vi-VN")}`
                : "-")}
          </span>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-900 pb-2">
        Chọn phương thức thanh toán
      </label>
      <div className="grid grid-cols-1 gap-2">
        {[
          {
            value: "bank_transfer",
            label: "Chuyển khoản ngân hàng",
            icon: Banknote,
            color: "primary",
            logo: (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  bgcolor: "#1976D2",
                  color: "white",
                  borderRadius: 1,
                  fontSize: "10px",
                  fontWeight: "bold",
                  mr: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                BK
              </Box>
            ),
          },
          {
            value: "vnpay",
            label: "VNPay",
            icon: CreditCard,
            color: "info",
            logo: (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  bgcolor: "#0055A6",
                  color: "white",
                  borderRadius: 1,
                  fontSize: "10px",
                  fontWeight: "bold",
                  mr: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                VN
              </Box>
            ),
          },
          {
            value: "momo",
            label: "MoMo",
            icon: Smartphone,
            color: "secondary",
            logo: (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  bgcolor: "#D82D8B",
                  color: "white",
                  borderRadius: 1,
                  fontSize: "10px",
                  fontWeight: "bold",
                  mr: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                M
              </Box>
            ),
          },
        ].map((method, idx) => {
          const Icon = method.icon;
          const isSelected = selectedPaymentMethod === method.value;
          return (
            <PaymentMethodCard
              key={method.value || idx}
              selected={isSelected}
              disabled={paymentLoading || qrCodeData}
              onClick={() => handleSelectPaymentMethod(method.value)}
              sx={{
                bgcolor: isSelected
                  ? method.value === "bank_transfer"
                    ? "#E3F2FD"
                    : method.value === "vnpay"
                    ? "#E1F5FE"
                    : method.value === "momo"
                    ? "#FCE4EC"
                    : "white"
                  : "white",
                borderColor: isSelected
                  ? method.value === "bank_transfer"
                    ? "#1976D2"
                    : method.value === "vnpay"
                    ? "#0055A6"
                    : method.value === "momo"
                    ? "#D82D8B"
                    : "grey.300"
                  : "grey.300",
                borderWidth: isSelected ? 2 : 1,
                boxShadow: isSelected ? 3 : 1,
                "&:hover": {
                  bgcolor: isSelected
                    ? method.value === "bank_transfer"
                      ? "#BBDEFB"
                      : method.value === "vnpay"
                      ? "#B3E5FC"
                      : method.value === "momo"
                      ? "#F8BBD9"
                      : "grey.50"
                    : "grey.50",
                  borderColor: isSelected
                    ? method.value === "bank_transfer"
                      ? "#1565C0"
                      : method.value === "vnpay"
                      ? "#004BA0"
                      : method.value === "momo"
                      ? "#C2185B"
                      : "grey.400"
                    : "grey.400",
                  transform: isSelected ? "scale(1.02)" : "scale(1.01)",
                  boxShadow: isSelected ? 4 : 2,
                },
                transition: "all 0.2s ease-in-out",
                position: "relative",
                overflow: "hidden",
                "&::before": isSelected
                  ? {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isSelected
                        ? method.value === "bank_transfer"
                          ? "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
                          : method.value === "vnpay"
                          ? "linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)"
                          : method.value === "momo"
                          ? "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)"
                          : "none"
                        : "none",
                      opacity: 0.3,
                      pointerEvents: "none",
                    }
                  : {},
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 45,
                    height: 45,
                    borderRadius: 2,
                    mr: 2,
                    bgcolor: isSelected
                      ? `${method.color}.main`
                      : (theme) => theme.palette.grey[100],
                    color: isSelected ? "white" : "grey.600",
                    boxShadow: isSelected ? 2 : 1,
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Icon size={24} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  {method.logo && method.logo}
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color={isSelected ? `${method.color}.main` : "GrayText"}
                    sx={{ flex: 1 }}
                  >
                    {method.label}
                  </Typography>
                </Box>
                {isSelected && (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: `${method.color}.main`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 2,
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": {
                          boxShadow: `0 0 0 0 ${method.color}.main`,
                        },
                        "70%": {
                          boxShadow: `0 0 0 10px rgba(0, 0, 0, 0)`,
                        },
                        "100%": {
                          boxShadow: `0 0 0 0 rgba(0, 0, 0, 0)`,
                        },
                      },
                    }}
                  >
                    <CheckCircle size={16} color="white" />
                  </Box>
                )}
              </CardContent>
            </PaymentMethodCard>
          );
        })}
      </div>
    </div>
  );

  const renderPaymentTabs = () => (
    <div className="mb-6">
      <div className="flex bg-gray-100 rounded-3xl p-2">
        {booking.paymentStatus !== "deposit_paid" &&
          booking.paymentStatus !== "fully_paid" &&
          depositAmountValue > 0 && (
            <button
              className={`flex-1 px-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
                activePaymentTab === 0
                  ? "bg-white text-orange-600 border border-orange-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-800"
              } ${
                paymentLoading || qrCodeData
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => handleTabChange(0)}
              disabled={paymentLoading || qrCodeData}
            >
              <div className="flex items-center justify-center">
                <Percent className="w-4 h-4 mr-2" />
                Thanh toán cọc (20%)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPrice(amountForDepositTab)}
              </div>
            </button>
          )}

        {booking.paymentStatus !== "fully_paid" && amountForFullTab > 0 && (
          <button
            className={`flex-1 px-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
              activePaymentTab === 1
                ? "bg-white text-green-600 border border-green-600 shadow-md transform scale-105"
                : "text-gray-600 hover:text-gray-800"
            } ${
              paymentLoading || qrCodeData
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleTabChange(1)}
            disabled={paymentLoading || qrCodeData}
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {booking.paymentStatus === "deposit_paid"
                ? "Thanh toán còn lại"
                : "Thanh toán toàn bộ"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPrice(amountForFullTab)}
            </div>
          </button>
        )}
      </div>
    </div>
  );

  const renderQRSection = () => {
    if (!qrCodeData && randomQR) {
      const { qrData, amount, bookingCode } = randomQR;
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrData
      )}`;
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Back Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
            <Button
              onClick={() => setRandomQR(null)}
              variant="outlined"
              color="primary"
              startIcon={<ChevronLeft size={16} />}
              sx={{ borderRadius: 2 }}
            >
              Trở lại
            </Button>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <QRContainer>
              <QrCode size={48} style={{ margin: "0 auto 12px" }} />
              <Typography variant="h6" fontWeight="semibold" sx={{ mb: 1 }}>
                Mã QR ngẫu nhiên (Test)
              </Typography>
              <Typography variant="body2" sx={{ color: "primary.100" }}>
                Quét mã để test chức năng thanh toán
              </Typography>
            </QRContainer>

            <Paper sx={{ p: 2, display: "inline-block", borderRadius: 3 }}>
              <img
                src={qrImage}
                alt="Random QR Code"
                style={{ width: "180px", height: "180px" }}
              />
            </Paper>
          </Box>

          <InfoContainer>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Banknote size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="textSecondary">
                    Số tiền thanh toán
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(amount)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Info size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="textSecondary">
                    Nội dung chuyển khoản
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  color="textPrimary"
                >
                  {bookingCode}
                </Typography>
              </Box>
            </Box>
          </InfoContainer>

          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Đây là mã QR ngẫu nhiên để test chức năng. Khi quét sẽ hiện số tiền
            và nội dung là mã booking.
          </Alert>

          <Button
            onClick={handleBackToChooseMethod}
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            ← Chọn lại phương thức thanh toán
          </Button>
        </Box>
      );
    }

    // QR thành công khi fully_paid hoặc deposit_paid
    if (
      (qrCodeData &&
        (paymentStatus === "fully_paid" || paymentStatus === "deposit_paid")) ||
      (!qrCodeData &&
        (booking?.paymentStatus === "fully_paid" ||
          booking?.paymentStatus === "deposit_paid"))
    ) {
      // Lấy bookingCode và số tiền đã thanh toán
      const code = booking?.bookingCode || qrCodeData?.bookingCode || "";
      const paidAmount =
        booking?.paymentBreakdown?.totalPaid || qrCodeData?.amount || 0;
      const qrSuccessData = `PAID:${code}`;
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrSuccessData
      )}`;
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Back Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
            <Button
              onClick={() => {
                dispatch(clearQRCodeData());
                setRandomQR(null);
              }}
              variant="outlined"
              color="success"
              startIcon={<ChevronLeft size={16} />}
              sx={{ borderRadius: 2 }}
            >
              Trở lại
            </Button>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <SuccessContainer>
              <CheckCircle size={48} style={{ margin: "0 auto 12px" }} />
              <Typography variant="h6" fontWeight="semibold" sx={{ mb: 1 }}>
                Thanh toán thành công!
              </Typography>
              <Typography variant="body2" sx={{ color: "success.100" }}>
                Quét mã để xác nhận thanh toán thành công
              </Typography>
            </SuccessContainer>

            <Paper
              sx={{
                p: 2,
                display: "inline-block",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "success.200",
              }}
            >
              <img
                src={qrImage}
                alt="QR Thành công"
                style={{ width: "180px", height: "180px" }}
              />
            </Paper>
          </Box>

          <InfoContainer sx={{ borderColor: "success.200" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Banknote size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="textSecondary">
                    Số tiền đã thanh toán
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {formatPrice(paidAmount)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Info size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="textSecondary">
                    Mã booking
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  color="textPrimary"
                >
                  {code}
                </Typography>
              </Box>
            </Box>
          </InfoContainer>

          <Alert severity="success" sx={{ borderRadius: 3 }}>
            Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.
          </Alert>

          {process.env.NODE_ENV === "development" &&
            qrCodeData?.transactionId && (
              <Button
                onClick={handleSimulatePayment}
                variant="contained"
                color="warning"
                fullWidth
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                🧪 Mô phỏng chuyển sang invoice
              </Button>
            )}
        </Box>
      );
    }

    if (!qrCodeData) return null;

    const {
      transactionId,
      transactionReference,
      amount,
      paymentMethod,
      bankInfo,
      paymentUrl,
      qrCodeUrl: momoQrUrl,
      deeplink,
    } = qrCodeData;

    let paymentContent;

    if (paymentMethod === "vnpay" && paymentUrl) {
      paymentContent = (
        <Box sx={{ textAlign: "center" }}>
          <Button
            onClick={handleBackToChooseMethod}
            variant="outlined"
            color="primary"
            sx={{ mb: 2, borderRadius: 2 }}
          >
            ← Chọn lại phương thức thanh toán
          </Button>

          <Alert severity="info" sx={{ mb: 2, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                ml: 7,
              }}
            >
              <CreditCard size={48} style={{ marginBottom: 12 }} />
              <Typography variant="h6" fontWeight="semibold">
                Thanh toán VNPay
              </Typography>
              <Typography variant="body2">
                Bạn sẽ được chuyển đến cổng thanh toán VNPay
              </Typography>
            </Box>
          </Alert>

          <Button
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="info"
            endIcon={<ExternalLink size={20} />}
            sx={{ borderRadius: 3, py: 1.5, px: 3 }}
          >
            Thanh toán ngay
          </Button>
        </Box>
      );
    } else if (
      paymentMethod === "momo" &&
      (paymentUrl || momoQrUrl || deeplink)
    ) {
      let momoDisplay;
      if (momoQrUrl) {
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          momoQrUrl
        )}`;
        momoDisplay = (
          <Box>
            <Button
              onClick={handleBackToChooseMethod}
              variant="outlined"
              color="primary"
              sx={{ mb: 2, borderRadius: 2 }}
            >
              ← Chọn lại phương thức thanh toán
            </Button>

            <Box
              sx={{
                background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)",
                borderRadius: 3,
                p: 2,
                color: "white",
                textAlign: "center",
              }}
            >
              <Smartphone size={32} style={{ margin: "0 auto 16px" }} />
              <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                Quét mã MoMo
              </Typography>
              <Paper sx={{ p: 2, display: "inline-block", borderRadius: 3 }}>
                <img
                  src={qrImage}
                  alt="MoMo QR Code"
                  style={{ width: "180px", height: "180px" }}
                />
              </Paper>
            </Box>
          </Box>
        );
      } else if (paymentUrl) {
        momoDisplay = (
          <Button
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)",
              borderRadius: 3,
              py: 2,
              px: 4,
              fontWeight: "bold",
            }}
            endIcon={<ExternalLink size={20} />}
          >
            Thanh toán MoMo
          </Button>
        );
      }
      paymentContent = <Box sx={{ textAlign: "center" }}>{momoDisplay}</Box>;
    } else if (paymentMethod === "bank_transfer" && bankInfo && showBankInfo) {
      return (
        <Box
          sx={{
            background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
            borderRadius: 3,
            p: 3,
            border: "1px solid",
            borderColor: "success.200",
            position: "relative",
          }}
        >
          <Button
            onClick={handleBackToChooseMethod}
            variant="outlined"
            color="primary"
            sx={{ mb: 2, borderRadius: 2 }}
          >
            ← Chọn lại phương thức thanh toán
          </Button>
          <IconButton
            onClick={() => setShowBankInfo(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "success.main",
            }}
          >
            <X size={20} />
          </IconButton>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                bgcolor: "success.dark",
                border: "1px solid",
                borderColor: "success.100",
                borderRadius: "50%",
                mb: 0.5,
                mx: "auto",
              }}
            >
              <Banknote size={24} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="success.dark">
              Chờ xác nhận chuyển khoản
            </Typography>
            <Typography variant="caption" color="success.dark">
              Vui lòng chuyển khoản đúng thông tin bên dưới để hệ thống tự động
              xác nhận.
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "success.200",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "0.5px solid",
                  borderColor: "gray.100",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Ngân hàng:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="semibold"
                  color="textPrimary"
                >
                  {bankInfo.bankName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "0.5px solid",
                  borderColor: "gray.100",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Số tài khoản:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h6"
                    fontFamily="monospace"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ mr: 1 }}
                  >
                    {bankInfo.accountNumber}
                  </Typography>
                  <IconButton
                    onClick={() =>
                      copyToClipboard(bankInfo.accountNumber, "Số tài khoản")
                    }
                    size="small"
                    color="success"
                  >
                    <Copy size={16} />
                  </IconButton>
                  {copiedText === "Số tài khoản" && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ ml: 0.5 }}
                    >
                      Đã copy!
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "0.5px solid",
                  borderColor: "gray.100",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Chủ tài khoản:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="semibold"
                  color="textPrimary"
                >
                  {bankInfo.accountName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Nội dung chuyển khoản:
                </Typography>
                <IconButton
                  onClick={() =>
                    copyToClipboard(bankInfo.transferContent, "Nội dung CK")
                  }
                  size="small"
                  color="success"
                >
                  <Copy size={16} />
                </IconButton>
                {copiedText === "Nội dung CK" && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ ml: 0.5 }}
                  >
                    Đã copy!
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  borderBottom: "0.5px solid",
                  borderColor: "gray.100",
                }}
              >
                <Typography
                  variant="body1"
                  fontFamily="monospace"
                  color="success.main"
                  fontWeight="bold"
                  sx={{
                    textAlign: "right",
                    mt: 0,
                  }}
                >
                  {bankInfo.transferContent}
                </Typography>{" "}
              </Box>

              {qrCodeData?.expiredAt && (
                <Typography variant="caption" color="textSecondary">
                  Hạn chuyển khoản:{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    fontWeight="semibold"
                  >
                    {new Date(qrCodeData.expiredAt).toLocaleString("vi-VN")}
                  </Typography>
                </Typography>
              )}
            </Box>
          </Paper>

          <Alert severity="warning" sx={{ mt: 2, borderRadius: 3 }}>
            Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong vòng vài
            phút.
          </Alert>

          {/* Test buttons for development */}
          {process.env.NODE_ENV === "development" &&
            qrCodeData?.transactionId && (
              <>
                {paymentStatus === "pending" && (
                  <Button
                    onClick={async () => {
                      if (!qrCodeData?.transactionId) return;
                      const token = localStorage.getItem("token");
                      try {
                        await fetch(
                          `http://localhost:9999/api/v1/payments/transaction/${qrCodeData.transactionId}/simulate`,
                          {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        if (bookingIdFortransaction) {
                          dispatch(
                            fetchCustomerBookingDetail(bookingIdFortransaction)
                          );
                        }
                      } catch (err) {}
                    }}
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 3, py: 1.5 }}
                  >
                    🧪 Test chuyển trạng thái thành công
                  </Button>
                )}

                {(paymentStatus === "fully_paid" ||
                  paymentStatus === "deposit_paid") && (
                  <Button
                    onClick={handleSimulatePayment}
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 3, py: 1.5 }}
                  >
                    🧪 Mô phỏng chuyển sang invoice
                  </Button>
                )}
              </>
            )}
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {paymentContent}

        {/* Payment Status */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {isPolling && paymentStatus === "pending" && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Đang kiểm tra thanh toán...
            </Alert>
          )}
        </Box>

        {/* Payment Info */}
        <InfoContainer>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Banknote size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2" color="textSecondary">
                  Số tiền thanh toán
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(amount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Info size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2" color="textSecondary">
                  Mã giao dịch
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  color="textPrimary"
                  sx={{ mr: 1 }}
                >
                  {transactionReference}
                </Typography>
                <IconButton
                  onClick={() => copyToClipboard(transactionReference, "Mã GD")}
                  size="small"
                  color="primary"
                >
                  <Copy size={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </InfoContainer>

        {/* Instructions */}
        {isPolling && paymentMethod !== "bank_transfer" && (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Vui lòng không đóng cửa sổ này. Trạng thái thanh toán sẽ được cập
            nhật tự động.
          </Alert>
        )}

        {/* Test Button */}
        {process.env.NODE_ENV === "development" &&
          transactionId &&
          paymentStatus === "pending" && (
            <Button
              onClick={async () => {
                if (!qrCodeData?.transactionId) return;
                const token = localStorage.getItem("token");
                try {
                  await fetch(
                    `http://localhost:9999/api/v1/payments/transaction/${qrCodeData.transactionId}/simulate`,
                    {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (bookingIdFortransaction) {
                    dispatch(
                      fetchCustomerBookingDetail(bookingIdFortransaction)
                    );
                  }
                } catch (err) {}
              }}
              variant="contained"
              color="warning"
              fullWidth
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              🧪 Test đã thanh toán thành công
            </Button>
          )}
      </Box>
    );
  };

  return (
    <StyledDialog
      open={showTransactionModal}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClose();
      }}
      disableEscapeKeyDown={true}
      TransitionComponent={Fade}
    >
      <StyledDialogTitle>
        <div className="flex items-center">
          <ChevronLeft className="w-6 h-6 text-white mr-2" />
          Thanh toán booking
        </div>
      </StyledDialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left: Booking Info (4/10) */}
          <Grid item xs={12} md={6}>
            <BookingInfoCard>
              <CardContent>
                <Box className="flex items-center justify-between pb-2">
                  <Box className="text-base justify-start font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-1 text-blue-600" />
                    <Typography variant="h6" color="textPrimary">
                      Thông tin booking
                    </Typography>
                  </Box>
                  <Chip
                    label={getPaymentStatusText(booking.paymentStatus)}
                    size="small"
                    color={
                      booking.paymentStatus === "fully_paid"
                        ? "success"
                        : booking.paymentStatus === "deposit_paid"
                        ? "warning"
                        : booking.paymentStatus === "pending"
                        ? "info"
                        : "default"
                    }
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: "grid", gap: 1 }}>
                  <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                    <Box className="text-gray-600 flex items-center">
                      <Info size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="textSecondary">
                        Mã booking
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="semibold"
                      color="textPrimary"
                    >
                      {booking.bookingCode}
                    </Typography>
                  </Box>

                  <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                    <Box className="text-gray-600 flex items-center">
                      <Banknote className="w-4 h-4 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Tổng tiền
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatPrice(
                        booking.paymentBreakdown?.totalAmount ||
                          booking.amount ||
                          0
                      )}
                    </Typography>
                  </Box>

                  {booking.paymentBreakdown?.totalPaid > 0 && (
                    <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                      <Box className="text-gray-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <Typography variant="body2" color="textSecondary">
                          Đã thanh toán
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="semibold"
                        color="success.main"
                      >
                        {formatPrice(booking.paymentBreakdown.totalPaid)}
                      </Typography>
                    </Box>
                  )}

                  {booking.paymentBreakdown?.depositAmount > 0 &&
                    booking.paymentStatus !== "deposit_paid" &&
                    booking.paymentStatus !== "fully_paid" && (
                      <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                        <Box className="text-gray-600 flex items-center">
                          <Percent className="w-4 h-4 mr-2" />
                          <Typography variant="body2" color="textSecondary">
                            Tiền cọc
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight="semibold"
                          color="warning.main"
                        >
                          {formatPrice(booking.paymentBreakdown.depositAmount)}
                        </Typography>
                      </Box>
                    )}

                  {booking.paymentStatus === "deposit_paid" &&
                    booking.paymentBreakdown?.remainingAmount > 0 && (
                      <Box className="flex items-center justify-between py-2">
                        <Box className="text-gray-600 flex items-center">
                          <Timer className="w-4 h-4 mr-2" />
                          <Typography variant="body2" color="textSecondary">
                            Còn lại
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight="semibold"
                          color="error.main"
                        >
                          {formatPrice(
                            booking.paymentBreakdown.remainingAmount
                          )}
                        </Typography>
                      </Box>
                    )}

                  <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                    <Box className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Số khách
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="semibold"
                      color="textPrimary"
                    >
                      {totalGuests} khách
                    </Typography>
                  </Box>

                  <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                    <Box className="text-gray-600 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Số phòng đặt
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="semibold"
                      color="textPrimary"
                    >
                      {displayTotalRooms} phòng
                    </Typography>
                  </Box>

                  {displayBookedRooms.length > 0 && (
                    <Box className="border-b border-blue-100">
                      <List dense>
                        {displayBookedRooms.map((room, idx) => (
                          <ListItem
                            key={room._id || room.roomId?._id || room.id || idx}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              bgcolor: "primary.50",
                              borderRadius: 1,
                              mb: 0.5,
                              border: "1px solid",
                              borderColor: "primary.100",
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight="semibold"
                              color="primary.main"
                            >
                              {room.roomId?.name || room.name || "Phòng"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              x {room.quantity}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Dịch vụ */}
                  {bookedServices.length > 0 && (
                    <Box className="border-b border-blue-100">
                      <Box className="text-gray-600 flex items-center">
                        <Info className="w-4 h-4 mr-2" />
                        <Typography variant="body2" color="textSecondary">
                          Dịch vụ đã chọn
                        </Typography>
                      </Box>
                      <List dense>
                        {bookedServices.map((service, idx) => (
                          <ListItem
                            key={
                              service._id ||
                              service.serviceId ||
                              service.id ||
                              idx
                            }
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {service.serviceId?.serviceName ||
                                    service.serviceId?.name ||
                                    service.name ||
                                    service.serviceName ||
                                    "Dịch vụ"}
                                  {` x${
                                    service.quantity ||
                                    service.serviceQuantity ||
                                    1
                                  }`}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Ngày đặt */}
                  <Box className="flex items-center justify-between py-2 border-b border-blue-100">
                    <Box className="text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Ngày đặt
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="semibold"
                      color="textPrimary"
                    >
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </Typography>
                  </Box>

                  <Box className="flex items-start py-2 border-b border-blue-100">
                    <Box className="text-gray-600 flex items-center min-w-[90px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Lịch trình
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="semibold"
                      color="textPrimary"
                      sx={{
                        flex: 1,
                        textAlign: "right",
                        wordBreak: "break-word",
                      }}
                    >
                      {scheduleObj?.displayText ||
                        (scheduleObj?.scheduleId?.startDate &&
                        scheduleObj?.scheduleId?.endDate
                          ? `${new Date(
                              scheduleObj.scheduleId.startDate
                            ).toLocaleDateString("vi-VN")} - ${new Date(
                              scheduleObj.scheduleId.endDate
                            ).toLocaleDateString("vi-VN")}`
                          : "-")}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </BookingInfoCard>
          </Grid>
          {/* Right: Payment Section (6/10) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                {booking.paymentStatus === "fully_paid" ? (
                  <SuccessContainer>
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Thanh toán hoàn tất!
                    </h3>
                    <p className="text-green-700">
                      Booking này đã được thanh toán đầy đủ.
                    </p>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 2, borderRadius: 2 }}
                      onClick={() => {
                        dispatch(closeTransactionModal());
                        dispatch(clearQRCodeData());
                        localStorage.removeItem("bookingIdForTransaction");
                      }}
                    >
                      Hoàn tất
                    </Button>
                  </SuccessContainer>
                ) : booking.paymentStatus === "deposit_paid" ? (
                  <SuccessContainer>
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-100 mb-2">
                      Đã đặt cọc thành công!
                    </h3>
                    <p className="text-gray-100">
                      Bạn đã thanh toán tiền cọc. Vui lòng thanh toán phần còn
                      lại trước hạn.
                    </p>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 2, borderRadius: 2 }}
                      onClick={() => {
                        dispatch(closeTransactionModal());
                        dispatch(clearQRCodeData());
                        localStorage.removeItem("bookingIdForTransaction");
                      }}
                    >
                      Hoàn tất
                    </Button>
                  </SuccessContainer>
                ) : !qrCodeData ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color="textPrimary"
                        sx={{ pb: 1 }}
                      >
                        Chọn phương thức thanh toán
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: (theme) => theme.palette.grey[50],
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: (theme) => theme.palette.grey[200],
                          boxShadow: 1,
                        }}
                      >
                        <Box sx={{ display: "grid", gap: 1.5 }}>
                          {[
                            {
                              value: "bank_transfer",
                              label: "Chuyển khoản ngân hàng",
                              icon: Banknote,
                              color: "primary",
                              logo: (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 20,
                                    height: 20,
                                    bgcolor: "#1976D2",
                                    color: "white",
                                    borderRadius: 1,
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    mr: 1,
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  BK
                                </Box>
                              ),
                            },
                            {
                              value: "vnpay",
                              label: "VNPay",
                              icon: CreditCard,
                              color: "info",
                              logo: (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 20,
                                    height: 20,
                                    bgcolor: "#0055A6",
                                    color: "white",
                                    borderRadius: 1,
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    mr: 1,
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  VN
                                </Box>
                              ),
                            },
                            {
                              value: "momo",
                              label: "MoMo",
                              icon: Smartphone,
                              color: "secondary",
                              logo: (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 20,
                                    height: 20,
                                    bgcolor: "#D82D8B",
                                    color: "white",
                                    borderRadius: 1,
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    mr: 1,
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  M
                                </Box>
                              ),
                            },
                          ].map((method, idx) => {
                            const Icon = method.icon;
                            const isSelected =
                              selectedPaymentMethod === method.value;
                            return (
                              <PaymentMethodCard
                                key={method.value || idx}
                                selected={isSelected}
                                disabled={paymentLoading || qrCodeData}
                                onClick={() =>
                                  handleSelectPaymentMethod(method.value)
                                }
                                sx={{
                                  bgcolor: isSelected
                                    ? method.value === "bank_transfer"
                                      ? "#E3F2FD"
                                      : method.value === "vnpay"
                                      ? "#E1F5FE"
                                      : method.value === "momo"
                                      ? "#FCE4EC"
                                      : "white"
                                    : "white",
                                  borderColor: isSelected
                                    ? method.value === "bank_transfer"
                                      ? "#1976D2"
                                      : method.value === "vnpay"
                                      ? "#0055A6"
                                      : method.value === "momo"
                                      ? "#D82D8B"
                                      : "grey.300"
                                    : "grey.300",
                                  borderWidth: isSelected ? 2 : 1,
                                  boxShadow: isSelected ? 3 : 1,
                                  "&:hover": {
                                    bgcolor: isSelected
                                      ? method.value === "bank_transfer"
                                        ? "#BBDEFB"
                                        : method.value === "vnpay"
                                        ? "#B3E5FC"
                                        : method.value === "momo"
                                        ? "#F8BBD9"
                                        : "grey.50"
                                      : "grey.50",
                                    borderColor: isSelected
                                      ? method.value === "bank_transfer"
                                        ? "#1565C0"
                                        : method.value === "vnpay"
                                        ? "#004BA0"
                                        : method.value === "momo"
                                        ? "#C2185B"
                                        : "grey.400"
                                      : "grey.400",
                                    transform: isSelected
                                      ? "scale(1.02)"
                                      : "scale(1.01)",
                                    boxShadow: isSelected ? 4 : 2,
                                  },
                                  transition: "all 0.2s ease-in-out",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": isSelected
                                    ? {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: isSelected
                                          ? method.value === "bank_transfer"
                                            ? "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
                                            : method.value === "vnpay"
                                            ? "linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)"
                                            : method.value === "momo"
                                            ? "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)"
                                            : "none"
                                          : "none",
                                        opacity: 0.3,
                                        pointerEvents: "none",
                                      }
                                    : {},
                                }}
                              >
                                <CardContent
                                  sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    position: "relative",
                                    zIndex: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 48,
                                      height: 48,
                                      borderRadius: 2,
                                      mr: 2,
                                      bgcolor: isSelected
                                        ? `${method.color}.main`
                                        : (theme) => theme.palette.grey[100],
                                      color: isSelected ? "white" : "grey.600",
                                      boxShadow: isSelected ? 2 : 1,
                                      transition: "all 0.2s ease-in-out",
                                    }}
                                  >
                                    <Icon size={24} />
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      flex: 1,
                                    }}
                                  >
                                    {method.logo && method.logo}
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                      color={
                                        isSelected
                                          ? `${method.color}.main`
                                          : "GrayText"
                                      }
                                      sx={{ flex: 1 }}
                                    >
                                      {method.label}
                                    </Typography>
                                  </Box>
                                  {isSelected && (
                                    <Box
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: "50%",
                                        bgcolor: `${method.color}.main`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: 2,
                                        animation: "pulse 2s infinite",
                                        "@keyframes pulse": {
                                          "0%": {
                                            boxShadow: `0 0 0 0 ${method.color}.main`,
                                          },
                                          "70%": {
                                            boxShadow: `0 0 0 10px rgba(0, 0, 0, 0)`,
                                          },
                                          "100%": {
                                            boxShadow: `0 0 0 0 rgba(0, 0, 0, 0)`,
                                          },
                                        },
                                      }}
                                    >
                                      <CheckCircle size={16} color="white" />
                                    </Box>
                                  )}
                                </CardContent>
                              </PaymentMethodCard>
                            );
                          })}
                        </Box>
                      </Paper>
                    </Box>

                    {/* Payment Tabs */}
                    <Box sx={{ my: 2 }}>
                      <Paper
                        sx={{
                          p: 1,
                          bgcolor: "grey.200",
                          borderRadius: 6,
                          boxShadow: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {booking.paymentStatus !== "deposit_paid" &&
                            booking.paymentStatus !== "fully_paid" &&
                            depositAmountValue > 0 && (
                              <Button
                                variant={
                                  activePaymentTab === 0 ? "contained" : "text"
                                }
                                onClick={() => handleTabChange(0)}
                                disabled={paymentLoading || qrCodeData}
                                sx={{
                                  flex: 1,
                                  borderRadius: 6,
                                  textTransform: "none",
                                  color:
                                    activePaymentTab === 0
                                      ? "white"
                                      : "text.secondary",
                                  bgcolor:
                                    activePaymentTab === 0
                                      ? "warning.main"
                                      : "grey.100",
                                  border:
                                    activePaymentTab === 0
                                      ? "2px solid"
                                      : "2px solid transparent",
                                  borderColor:
                                    activePaymentTab === 0
                                      ? "warning.dark"
                                      : "transparent",
                                  boxShadow: activePaymentTab === 0 ? 3 : 1,
                                  "&:hover": {
                                    bgcolor:
                                      activePaymentTab === 0
                                        ? "warning.dark"
                                        : "grey.300",
                                    transform:
                                      activePaymentTab === 0
                                        ? "scale(1.02)"
                                        : "scale(1.01)",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before":
                                    activePaymentTab === 0
                                      ? {
                                          content: '""',
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          background:
                                            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                                          pointerEvents: "none",
                                        }
                                      : {},
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
                                      alignItems: "center",
                                      fontSize: "13px",
                                    }}
                                  >
                                    <Percent
                                      size={16}
                                      style={{ marginRight: 4 }}
                                    />
                                    Thanh toán cọc (20%)
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    color={
                                      activePaymentTab === 0
                                        ? "white"
                                        : "textSecondary"
                                    }
                                  >
                                    {formatPrice(depositAmountValue)}
                                  </Typography>
                                </Box>
                              </Button>
                            )}

                          {booking.paymentStatus !== "fully_paid" &&
                            amountForFullTab > 0 && (
                              <Button
                                variant={
                                  activePaymentTab === 1 ? "contained" : "text"
                                }
                                onClick={() => handleTabChange(1)}
                                disabled={paymentLoading || qrCodeData}
                                sx={{
                                  flex: 1,
                                  borderRadius: 6,
                                  textTransform: "none",
                                  color:
                                    activePaymentTab === 1
                                      ? "white"
                                      : "text.secondary",
                                  bgcolor:
                                    activePaymentTab === 1
                                      ? "success.main"
                                      : "grey.100",
                                  border:
                                    activePaymentTab === 1
                                      ? "2px solid"
                                      : "2px solid transparent",
                                  borderColor:
                                    activePaymentTab === 1
                                      ? "success.dark"
                                      : "transparent",
                                  boxShadow: activePaymentTab === 1 ? 3 : 1,
                                  "&:hover": {
                                    bgcolor:
                                      activePaymentTab === 1
                                        ? "success.dark"
                                        : "grey.300",
                                    transform:
                                      activePaymentTab === 1
                                        ? "scale(1.02)"
                                        : "scale(1.01)",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before":
                                    activePaymentTab === 1
                                      ? {
                                          content: '""',
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          background:
                                            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                                          pointerEvents: "none",
                                        }
                                      : {},
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
                                      alignItems: "center",
                                      fontSize: "13px",
                                    }}
                                  >
                                    <CheckCircle
                                      size={16}
                                      style={{ marginRight: 4 }}
                                    />
                                    {booking.paymentStatus === "deposit_paid"
                                      ? "Thanh toán còn lại"
                                      : "Thanh toán toàn bộ"}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    color={
                                      activePaymentTab === 1
                                        ? "white"
                                        : "textSecondary"
                                    }
                                  >
                                    {formatPrice(amountForFullTab)}
                                  </Typography>
                                </Box>
                              </Button>
                            )}
                        </Box>
                      </Paper>
                    </Box>

                    {/* Payment Buttons */}
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {activePaymentTab === 0 &&
                        booking.paymentStatus !== "deposit_paid" &&
                        booking.paymentStatus !== "fully_paid" &&
                        depositAmountValue > 0 && (
                          <PaymentButton
                            variant="deposit"
                            onClick={handleDepositPayment}
                            disabled={paymentLoading}
                            fullWidth
                            sx={{ py: 2 }}
                          >
                            {paymentLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {getPaymentMethodIcon(selectedPaymentMethod)}
                                <Typography sx={{ ml: 1 }}>
                                  Thanh toán cọc (20%) -{" "}
                                  {formatPrice(amountForDepositTab)}
                                </Typography>
                                <ArrowRight
                                  size={20}
                                  style={{ marginLeft: 8 }}
                                />
                              </Box>
                            )}
                          </PaymentButton>
                        )}

                      {activePaymentTab === 1 &&
                        booking.paymentStatus !== "fully_paid" &&
                        amountForFullTab > 0 && (
                          <PaymentButton
                            variant="full"
                            onClick={handleFullOrRemainingPayment}
                            disabled={paymentLoading}
                            fullWidth
                            sx={{ py: 2 }}
                          >
                            {paymentLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {getPaymentMethodIcon(selectedPaymentMethod)}
                                <Typography sx={{ ml: 1 }}>
                                  {booking.paymentStatus === "deposit_paid"
                                    ? `Thanh toán còn lại - ${formatPrice(
                                        amountForFullTab
                                      )}`
                                    : `Thanh toán toàn bộ - ${formatPrice(
                                        amountForFullTab
                                      )}`}
                                </Typography>
                                <ArrowRight
                                  size={20}
                                  style={{ marginLeft: 8 }}
                                />
                              </Box>
                            )}
                          </PaymentButton>
                        )}
                    </Box>
                  </>
                ) : (
                  renderQRSection()
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default TransactionModal;
