import axios from "axios";
import * as paymentActions from "../actions/paymentActions";

import Swal from "sweetalert2";
import {
  setSubmitting,
  fetchInvoiceRequest,
  fetchInvoiceSuccess,
  fetchInvoiceFailure,
  closeTransactionModal,
  openInvoiceModal,
  clearQRCodeData,
} from "../actions";

let pollingInterval = null;

export const createDepositPayment =
  (bookingId, paymentMethod = "bank_transfer") =>
  async (dispatch, getState) => {
    dispatch(paymentActions.createTransactionRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const payload = { bookingId, paymentMethod };
      console.log("[DEBUG] Payload gửi lên /payments/deposit:", payload);
      const response = await axios.post(
        "http://localhost:9999/api/v1/payments/deposit",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const paymentInitiationData = response.data.data;
        dispatch(
          paymentActions.createTransactionSuccess(paymentInitiationData)
        );
        dispatch(paymentActions.setQRCodeData(paymentInitiationData));
        dispatch(setSubmitting(false));
        if (
          paymentInitiationData.transactionId &&
          paymentMethod !== "bank_transfer"
        ) {
          dispatch(
            startPaymentStatusPolling(paymentInitiationData.transactionId)
          );
        } else if (paymentMethod === "bank_transfer") {
          // Không hiện SweetAlert nữa vì đã có trong modal
        }
        return { success: true, data: paymentInitiationData };
      } else {
        throw new Error(
          response.data.message || "Tạo thanh toán cọc thất bại."
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(paymentActions.createTransactionFailure(errorMessage));
      if (
        errorMessage.includes(
          "Đã có giao dịch đang chờ xử lý cho booking này"
        ) &&
        error.response?.data?.data?.transactionId
      ) {
        Swal.fire({
          icon: "error",
          title: "Lỗi tạo thanh toán!",
          text: errorMessage,
          showCancelButton: true,
          confirmButtonText: "Quay lại giao dịch đang chờ",
          cancelButtonText: "Chọn phương thức mới",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch({
              type: "OPEN_TRANSACTION_MODAL",
              payload: {
                bookingId,
                transactionId: error.response.data.data.transactionId,
              },
            });
            dispatch(
              fetchTransactionById(error.response.data.data.transactionId)
            );
          } else {
            dispatch(clearQRCodeData());
            dispatch(paymentActions.createTransactionSuccess(null));
            dispatch(paymentActions.updatePaymentStatus("idle"));
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi tạo thanh toán cọc!",
          text: errorMessage,
        });
      }
      return { success: false, error: errorMessage };
    }
  };

export const createFullPayment =
  (bookingId, paymentMethod = "bank_transfer") =>
  async (dispatch, getState) => {
    dispatch(paymentActions.createTransactionRequest());
    dispatch(setSubmitting(true));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      const payload = { bookingId, paymentMethod };
      console.log("[DEBUG] Payload gửi lên /payments/full:", payload);
      const response = await axios.post(
        "http://localhost:9999/api/v1/payments/full",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const paymentInitiationData = response.data.data;
        dispatch(
          paymentActions.createTransactionSuccess(paymentInitiationData)
        );
        dispatch(paymentActions.setQRCodeData(paymentInitiationData));
        dispatch(setSubmitting(false));
        if (
          paymentInitiationData.transactionId &&
          paymentMethod !== "bank_transfer"
        ) {
          dispatch(
            startPaymentStatusPolling(paymentInitiationData.transactionId)
          );
        } else if (paymentMethod === "bank_transfer") {
          // Không hiện SweetAlert nữa vì đã có trong modal
        }
        return { success: true, data: paymentInitiationData };
      } else {
        throw new Error(
          response.data.message || "Tạo thanh toán đầy đủ thất bại."
        );
      }
    } catch (error) {
      dispatch(setSubmitting(false));
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(paymentActions.createTransactionFailure(errorMessage));
      if (
        errorMessage.includes(
          "Đã có giao dịch đang chờ xử lý cho booking này"
        ) &&
        error.response?.data?.data?.transactionId
      ) {
        Swal.fire({
          icon: "error",
          title: "Lỗi tạo thanh toán!",
          text: errorMessage,
          showCancelButton: true,
          confirmButtonText: "Quay lại giao dịch đang chờ",
          cancelButtonText: "Chọn phương thức mới",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch({
              type: "OPEN_TRANSACTION_MODAL",
              payload: {
                bookingId,
                transactionId: error.response.data.data.transactionId,
              },
            });
            dispatch(
              fetchTransactionById(error.response.data.data.transactionId)
            );
          } else {
            dispatch(clearQRCodeData());
            dispatch(paymentActions.createTransactionSuccess(null));
            dispatch(paymentActions.updatePaymentStatus("idle"));
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi tạo thanh toán cọc!",
          text: errorMessage,
        });
      }
      return { success: false, error: errorMessage };
    }
  };

export const startPaymentStatusPolling =
  (transactionIdOrRef) => async (dispatch, getState) => {
    const { currentPollingId, isPolling } = getState().payment;
    if (isPolling && currentPollingId === transactionIdOrRef) {
      return;
    }
    if (
      isPolling &&
      currentPollingId &&
      currentPollingId !== transactionIdOrRef
    ) {
      dispatch(stopPaymentStatusPolling());
    }
    dispatch(paymentActions.startPaymentPolling(transactionIdOrRef));
    pollingInterval = setInterval(async () => {
      const stillPollingThisId =
        getState().payment.currentPollingId === transactionIdOrRef &&
        getState().payment.isPolling;
      if (!stillPollingThisId) {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = null;
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          dispatch(stopPaymentStatusPolling());
          return;
        }
        const response = await axios.get(
          `http://localhost:9999/api/v1/payments/transaction/${transactionIdOrRef}/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const transaction = response.data.data;
        dispatch(paymentActions.updatePaymentStatus(transaction.status));
        if (transaction.status === "completed") {
          dispatch(stopPaymentStatusPolling());
          dispatch(handlePaymentSuccess(transaction._id));
        } else if (
          ["failed", "cancelled", "expired"].includes(transaction.status)
        ) {
          dispatch(stopPaymentStatusPolling());
          Swal.fire({
            icon: "error",
            title: `Thanh toán ${
              transaction.statusDisplay || transaction.status
            }!`,
            text:
              transaction.failureReason ||
              "Giao dịch không thành công. Vui lòng thử lại.",
          });
          dispatch(paymentActions.clearQRCodeData());
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          dispatch(stopPaymentStatusPolling());
        }
      }
    }, 5000);
  };

export const stopPaymentStatusPolling = () => (dispatch) => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  dispatch(paymentActions.stopPaymentPolling());
};

export const handlePaymentSuccess =
  (completedTransactionId) => async (dispatch) => {
    console.log(
      "Debug - handlePaymentSuccess called with transactionId:",
      completedTransactionId
    );
    dispatch(fetchInvoiceRequest());
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Debug - Fetching invoice for transaction:",
        completedTransactionId
      );
      const response = await axios.get(
        `http://localhost:9999/api/v1/invoices/by-transaction/${completedTransactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const invoiceData = response.data.data;

        dispatch(paymentActions.clearQRCodeData());
        dispatch(closeTransactionModal());

        dispatch(openInvoiceModal(invoiceData));
        dispatch(fetchInvoiceSuccess(invoiceData));

        // Hiển thị SweetAlert sau khi đã mở InvoiceModal
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Thanh toán thành công!",
            text: "Hóa đơn đã được tạo. Cảm ơn bạn đã sử dụng dịch vụ!",
            timer: 3000,
            showConfirmButton: false,
          });
        }, 100);
      } else {
        throw new Error(
          response.data.message || "Không thể lấy hóa đơn sau khi thanh toán."
        );
      }
    } catch (error) {
      console.error("Debug - handlePaymentSuccess error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(fetchInvoiceFailure(errorMessage));
      dispatch(paymentActions.clearQRCodeData());
      dispatch(closeTransactionModal());
      Swal.fire({
        icon: "warning",
        title: "Thanh toán thành công nhưng có lỗi lấy hóa đơn",
        text: `Vui lòng kiểm tra lịch sử giao dịch. Lỗi: ${errorMessage}`,
      });
    }
  };

export const simulatePaymentSuccess = (transactionId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:9999/api/v1/payments/transaction/${transactionId}/simulate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      Swal.fire({
        icon: "info",
        title: "Mô phỏng thanh toán",
        text: "Yêu cầu mô phỏng đã được gửi. Trạng thái sẽ cập nhật sau giây lát.",
        timer: 2000,
        showConfirmButton: false,
      });

      dispatch(handlePaymentSuccess(transactionId));
    } else {
      throw new Error(response.data.message || "Mô phỏng thất bại từ server.");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    Swal.fire({
      icon: "error",
      title: "Lỗi mô phỏng thanh toán!",
      text: errorMessage,
    });
  }
};

export const fetchTransactionById =
  (transactionId) => async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9999/api/v1/payments/transaction/${transactionId}/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        dispatch(paymentActions.setQRCodeData(response.data.data));
        dispatch(paymentActions.updatePaymentStatus(response.data.data.status));
      }
    } catch (error) {
      // Có thể dispatch lỗi nếu muốn
    }
  };

export const cancelTransaction = (transactionId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:9999/api/v1/payments/transaction/${transactionId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch({ type: "CLEAR_QR_CODE_DATA" });
    dispatch({ type: "CREATE_TRANSACTION_SUCCESS", payload: null });
    dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: "idle" });
    return true;
  } catch (err) {
    return false;
  }
};
