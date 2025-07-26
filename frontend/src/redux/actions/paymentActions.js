export const createTransactionRequest = () => ({
  type: "CREATE_TRANSACTION_REQUEST",
});
export const createTransactionSuccess = (transaction) => ({
  type: "CREATE_TRANSACTION_SUCCESS",
  payload: transaction,
});
export const createTransactionFailure = (error) => ({
  type: "CREATE_TRANSACTION_FAILURE",
  payload: error,
});
export const setQRCodeData = (qrData) => ({
  type: "SET_QR_CODE_DATA",
  payload: qrData,
});
export const clearQRCodeData = () => ({ type: "CLEAR_QR_CODE_DATA" });
export const startPaymentPolling = (transactionId) => ({
  type: "START_PAYMENT_POLLING",
  payload: transactionId,
});
export const stopPaymentPolling = () => ({ type: "STOP_PAYMENT_POLLING" });
export const updatePaymentStatus = (status) => ({
  type: "UPDATE_PAYMENT_STATUS",
  payload: status,
});
