export const setActiveTab = (tabIndex) => ({
  type: "SET_ACTIVE_TAB",
  payload: tabIndex,
});
export const openRoomModal = (room) => ({
  type: "OPEN_ROOM_MODAL",
  payload: room,
});
export const closeRoomModal = () => ({ type: "CLOSE_ROOM_MODAL" });
export const openBookingModal = () => ({ type: "OPEN_BOOKING_MODAL" });
export const closeBookingModal = () => ({ type: "CLOSE_BOOKING_MODAL" });
export const openRegulationsWindow = () => ({
  type: "OPEN_REGULATIONS_WINDOW",
});
export const closeRegulationsWindow = () => ({
  type: "CLOSE_REGULATIONS_WINDOW",
});
export const closeFaqWindow = () => ({ type: "CLOSE_FAQ_WINDOW" });
export const setSubmitting = (isSubmitting) => ({
  type: "SET_SUBMITTING",
  payload: isSubmitting,
});
export const openConfirmationModal = (confirmationData) => ({
  type: "OPEN_CONFIRMATION_MODAL",
  payload: confirmationData,
});
export const closeConfirmationModal = () => ({
  type: "CLOSE_CONFIRMATION_MODAL",
});
export const setConfirmationData = (data) => ({
  type: "SET_CONFIRMATION_DATA",
  payload: data,
});
export const openTransactionModal = (bookingId) => ({
  type: "OPEN_TRANSACTION_MODAL",
  payload: { bookingId },
});
export const closeTransactionModal = () => ({
  type: "CLOSE_TRANSACTION_MODAL",
});
export const setActivePaymentTab = (tabIndex) => ({
  type: "SET_ACTIVE_PAYMENT_TAB",
  payload: tabIndex,
});
export const openInvoiceModal = (invoiceData) => ({
  type: "OPEN_INVOICE_MODAL",
  payload: invoiceData,
});
export const closeInvoiceModal = () => ({ type: "CLOSE_INVOICE_MODAL" });
export const setInvoiceData = (invoiceData) => ({
  type: "SET_INVOICE_DATA",
  payload: invoiceData,
});
