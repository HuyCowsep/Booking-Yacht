export const fetchInvoiceRequest = () => ({ type: "FETCH_INVOICE_REQUEST" });
export const fetchInvoiceSuccess = (invoice) => ({
  type: "FETCH_INVOICE_SUCCESS",
  payload: invoice,
});
export const fetchInvoiceFailure = (error) => ({
  type: "FETCH_INVOICE_FAILURE",
  payload: error,
});
export const resetInvoiceState = () => ({ type: "RESET_INVOICE_STATE" });
