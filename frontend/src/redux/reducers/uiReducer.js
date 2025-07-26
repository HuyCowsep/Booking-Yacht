// === UI REDUCER ===
const uiInitialState = {
  activeTab: 0,
  modals: {
    showRoomModal: false,
    showBookingModal: false,
    showConfirmationModal: false,
    showTransactionModal: false,
    bookingIdFortransaction: null,
    showInvoiceModal: false,
    invoiceData: null,
    selectedRoomForModal: null,
    confirmationData: null,
  },
  activePaymentTab: 0,
  windows: {
    showRegulationsWindow: false,
    showFaqWindow: false,
  },
};

const uiReducer = (state = uiInitialState, action) => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "OPEN_ROOM_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showRoomModal: true,
          selectedRoomForModal: action.payload,
        },
      };
    case "CLOSE_ROOM_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showRoomModal: false,
          selectedRoomForModal: null,
        },
      };
    case "OPEN_BOOKING_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showBookingModal: true,
        },
        bookingForm: {
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          guestCount: "1",
          requirements: "",
          checkInDate: "",
        },
        bookingErrors: {},
      };
    case "CLOSE_BOOKING_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showBookingModal: false,
        },
      };
    case "OPEN_CONFIRMATION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showConfirmationModal: true,
          confirmationData: action.payload,
        },
      };
    case "CLOSE_CONFIRMATION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showConfirmationModal: false,
          confirmationData: null,
        },
      };
    case "SET_CONFIRMATION_DATA":
      return {
        ...state,
        modals: {
          ...state.modals,
          confirmationData: action.payload,
        },
      };
    case "OPEN_TRANSACTION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showTransactionModal: true,
          showConfirmationModal: false,
          bookingIdFortransaction: action.payload?.bookingId || action.payload,
        },
        activePaymentTab: 0,
        currentBookingId: action.payload?.bookingId || action.payload,
      };
    case "CLOSE_TRANSACTION_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showTransactionModal: false,
          showConfirmationModal: false,
          confirmationData: null,
          bookingIdFortransaction: null,
        },
        activePaymentTab: 0,
        currentBookingId: null,
      };
    case "SET_ACTIVE_PAYMENT_TAB":
      return { ...state, activePaymentTab: action.payload };
    case "OPEN_INVOICE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showInvoiceModal: true,
          invoiceData: action.payload,
        },
      };
    case "CLOSE_INVOICE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          showInvoiceModal: false,
          invoiceData: null,
        },
      };
    case "SET_INVOICE_DATA":
      return {
        ...state,
        modals: {
          ...state.modals,
          invoiceData: action.payload,
        },
      };
    case "OPEN_REGULATIONS_WINDOW":
      return {
        ...state,
        windows: { ...state.windows, showRegulationsWindow: true },
      };
    case "CLOSE_REGULATIONS_WINDOW":
      return {
        ...state,
        windows: { ...state.windows, showRegulationsWindow: false },
      };
    case "OPEN_FAQ_WINDOW":
      return { ...state, windows: { ...state.windows, showFaqWindow: true } };
    case "CLOSE_FAQ_WINDOW":
      return { ...state, windows: { ...state.windows, showFaqWindow: false } };
    default:
      return state;
  }
};

export default uiReducer;
