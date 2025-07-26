// === PAYMENT REDUCER (MỚI) ===
const paymentInitialState = {
  currentTransaction: null,
  qrCodeData: null,
  paymentStatus: "idle",
  isPolling: false,
  pollingTransactionId: null,
  loading: false,
  error: null,
};

const paymentReducer = (state = paymentInitialState, action) => {
  switch (action.type) {
    case "CREATE_TRANSACTION_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
        paymentStatus: "pending",
      };
    case "CREATE_TRANSACTION_SUCCESS":
      return {
        ...state,
        loading: false,
        currentTransaction: action.payload ? action.payload.transaction : null,
        error: null,
      };
    case "CREATE_TRANSACTION_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        paymentStatus: "failed",
      };
    case "SET_QR_CODE_DATA":
      return {
        ...state,
        qrCodeData: action.payload,
      };
    case "CLEAR_QR_CODE_DATA":
      return {
        ...state,
        qrCodeData: null,
        currentTransaction: null,
        paymentStatus: "idle",
      };
    case "START_PAYMENT_POLLING":
      return {
        ...state,
        isPolling: true,
        pollingTransactionId: action.payload,
      };
    case "STOP_PAYMENT_POLLING":
      return {
        ...state,
        isPolling: false,
        pollingTransactionId: null,
      };
    case "UPDATE_PAYMENT_STATUS":
      return {
        ...state,
        paymentStatus: action.payload,
      };
    default:
      return state;
  }
};

export default paymentReducer;
