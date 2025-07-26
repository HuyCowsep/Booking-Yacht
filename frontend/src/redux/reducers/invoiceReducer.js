// === INVOICE REDUCER (MỚI) ===
const invoiceInitialState = {
  currentInvoice: null,
  loading: false,
  error: null,
};

const invoiceReducer = (state = invoiceInitialState, action) => {
  switch (action.type) {
    case "FETCH_INVOICE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_INVOICE_SUCCESS":
      return {
        ...state,
        loading: false,
        currentInvoice: action.payload,
        error: null,
      };
    case "FETCH_INVOICE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "RESET_INVOICE_STATE":
      return { ...invoiceInitialState };
    default:
      return state;
  }
};

export default invoiceReducer;
