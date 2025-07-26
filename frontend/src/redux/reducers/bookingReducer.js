// === BOOKING REDUCER ===
const bookingInitialState = {
  bookingId: null,
  rooms: [],
  schedules: {},
  selectedSchedule: "",
  selectedMaxPeople: "all",
  maxPeopleOptions: [],
  bookingForm: {
    checkInDate: "01/06/2025",
    guestCount: "1 Người lớn - 0 Trẻ em",
    fullName: "",
    phoneNumber: "",
    email: "",
    requirements: "",
  },
  guestCounter: {
    adults: 1,
    children: 0,
    childrenUnder10: 0,
    childrenAbove10: 0,
    isOpen: false,
  },
  bookingErrors: {},
  totalPrice: 0,
  submitting: false,
  loading: false,
  error: null,
  customerBookings: [],
  customerBookingsLoading: false,
  customerBookingsError: null,
  currentBookingDetail: null,
  bookingSubmitting: false,
  bookingDetailError: null,
  consultation: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  hasConsultation: false,
  editingBookingId: null,
  selectedYachtServices: [],
  selectedRoomQuantities: {},
};

const bookingReducer = (state = bookingInitialState, action) => {
  switch (action.type) {
    case "FETCH_ROOMS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_ROOMS_SUCCESS": {
      const { rooms, schedules, yachtId } = action.payload;
      const processedRooms = rooms.map((room) => ({
        ...room,
        id: room.id || room._id,
        quantity: room.quantity, // giữ nguyên quantity từ backend
        selectedQuantity: 0, // dùng trường này để quản lý số lượng đã chọn ở FE
        max_people:
          room.max_people ||
          (room.roomTypeId && room.roomTypeId.max_people) ||
          1,
        image: room.avatar,
        price: room.price || (room.roomTypeId && room.roomTypeId.price) || 0,
        area: room.area || "33",
        description: room.description || "Phòng thoải mái với view đẹp",
      }));
      const maxPeopleOptions = [
        ...new Set(
          processedRooms
            .map((r) => r.max_people)
            .filter((v) => typeof v === "number" && !isNaN(v) && v > 0)
        ),
      ].sort((a, b) => a - b);
      let newSchedules = { ...state.schedules };
      if (yachtId && Array.isArray(schedules)) {
        newSchedules[yachtId] = schedules;
      }
      return {
        ...state,
        loading: false,
        rooms: processedRooms,
        schedules: newSchedules,
        maxPeopleOptions,
      };
    }
    case "SET_CURRENT_BOOKING_ID":
      return { ...state, currentBookingId: action.payload };
    case "FETCH_ROOMS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "INCREMENT_ROOM_QUANTITY": {
      const updatedRoomsInc = state.rooms.map((room) =>
        room.id === action.payload
          ? { ...room, quantity: (room.quantity || 0) + 1 }
          : room
      );
      return {
        ...state,
        rooms: updatedRoomsInc,
        totalPrice: updatedRoomsInc.reduce(
          (sum, r) => sum + r.price * r.quantity,
          0
        ),
      };
    }
    case "DECREMENT_ROOM_QUANTITY": {
      const roomToDec = state.rooms.find((r) => r.id === action.payload);
      if (roomToDec && roomToDec.quantity > 0) {
        const updatedRoomsDec = state.rooms.map((room) =>
          room.id === action.payload
            ? { ...room, quantity: room.quantity - 1 }
            : room
        );
        return {
          ...state,
          rooms: updatedRoomsDec,
          totalPrice: updatedRoomsDec.reduce(
            (sum, r) => sum + r.price * r.quantity,
            0
          ),
        };
      }
      return state;
    }
    case "SET_SELECTED_SCHEDULE":
      return { ...state, selectedSchedule: action.payload };
    case "SET_SELECTED_MAX_PEOPLE":
      return { ...state, selectedMaxPeople: action.payload };
    case "UPDATE_BOOKING_FORM": {
      const { field, value } = action.payload;
      const newBookingForm = { ...state.bookingForm, [field]: value };
      const newBookingErrors = { ...state.bookingErrors };
      if (newBookingErrors[field]) delete newBookingErrors[field];
      return {
        ...state,
        bookingForm: newBookingForm,
        bookingErrors: newBookingErrors,
      };
    }
    case "SET_GUEST_COUNTER_OPEN":
      return {
        ...state,
        guestCounter: { ...state.guestCounter, isOpen: action.payload },
      };
    case "UPDATE_ADULTS": {
      const newAdults = Math.max(1, state.guestCounter.adults + action.payload);
      const guestText = `${newAdults} Người lớn - ${state.guestCounter.children} Trẻ em`;
      return {
        ...state,
        guestCounter: { ...state.guestCounter, adults: newAdults },
        bookingForm: { ...state.bookingForm, guestCount: guestText },
      };
    }
    case "UPDATE_CHILDREN": {
      const newChildren = Math.max(
        0,
        state.guestCounter.children + action.payload
      );
      const guestTextChildren = `${state.guestCounter.adults} Người lớn - ${newChildren} - Trẻ em`;
      return {
        ...state,
        guestCounter: { ...state.guestCounter, children: newChildren },
        bookingForm: { ...state.bookingForm, guestCount: guestTextChildren },
      };
    }
    case "UPDATE_CHILDREN_UNDER_10": {
      const newChildrenUnder10 = Math.max(
        0,
        state.guestCounter.childrenUnder10 + action.payload
      );
      return {
        ...state,
        guestCounter: {
          ...state.guestCounter,
          childrenUnder10: newChildrenUnder10,
        },
      };
    }
    case "UPDATE_CHILDREN_ABOVE_10": {
      const newChildrenAbove10 = Math.max(
        0,
        state.guestCounter.childrenAbove10 + action.payload
      );
      return {
        ...state,
        guestCounter: {
          ...state.guestCounter,
          childrenAbove10: newChildrenAbove10,
        },
      };
    }
    case "CLEAR_SELECTION":
      return {
        ...state,
        rooms: state.rooms.map((room) => ({ ...room, quantity: 0 })),
        totalPrice: 0,
      };
    case "RESET_FORMS":
      return {
        ...state,
        bookingForm: {
          checkInDate: "25/05/2025",
          guestCount: "1 Người lớn - 0 Trẻ em",
          fullName: "",
          phoneNumber: "",
          email: "",
          requirements: "",
        },
        bookingErrors: {},
        guestCounter: {
          adults: 1,
          children: 0,
          childrenUnder10: 0,
          childrenAbove10: 0,
          isOpen: false,
        },
      };
    case "SET_BOOKING_ERRORS":
      return { ...state, bookingErrors: action.payload };
    case "SET_FORM_VALIDATION": {
      const { field, isValid, errorMessage } = action.payload;
      return {
        ...state,
        bookingErrors: {
          ...state.bookingErrors,
          [field]: isValid ? undefined : errorMessage,
        },
      };
    }
    case "SET_BOOKING_ID":
      return { ...state, bookingId: action.payload };
    case "CLEAR_ALL_ERRORS":
      return {
        ...state,
        bookingErrors: {},
      };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "FETCH_CUSTOMER_BOOKINGS_REQUEST":
      return {
        ...state,
        customerBookingsLoading: true,
        customerBookingsError: null,
      };
    case "FETCH_CUSTOMER_BOOKINGS_SUCCESS":
      return {
        ...state,
        customerBookingsLoading: false,
        customerBookings: action.payload,
        customerBookingsError: null,
      };
    case "FETCH_CUSTOMER_BOOKINGS_FAILURE":
      return {
        ...state,
        customerBookingsLoading: false,
        customerBookingsError: action.payload,
      };
    case "FETCH_BOOKING_DETAIL_REQUEST":
      return {
        ...state,
        bookingSubmitting: true,
        bookingDetailError: null,
      };
    case "FETCH_BOOKING_DETAIL_SUCCESS":
      return {
        ...state,
        bookingSubmitting: false,
        currentBookingDetail: action.payload,
        bookingDetailError: null,
      };
    case "FETCH_BOOKING_DETAIL_FAILURE":
      return {
        ...state,
        bookingSubmitting: false,
        currentBookingDetail: null,
        bookingDetailError: action.payload,
      };
    case "FETCH_CONSULTATION_REQUEST":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: true,
          error: null,
          success: false,
        },
      };
    case "FETCH_CONSULTATION_SUCCESS":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          data: action.payload,
          success: true,
          error: null,
        },
        hasConsultation: !!action.payload,
      };
    case "FETCH_CONSULTATION_FAILURE":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          data: null,
          success: false,
          error: action.payload,
        },
        hasConsultation: false,
      };
    case "REQUEST_CONSULTATION_REQUEST":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: true,
          error: null,
          success: false,
        },
      };
    case "REQUEST_CONSULTATION_SUCCESS":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          data: action.payload,
          success: true,
          error: null,
        },
        hasConsultation: true,
      };
    case "REQUEST_CONSULTATION_FAILURE":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          error: action.payload,
          success: false,
        },
      };
    case "UPDATE_ROOMS":
      return {
        ...state,
        rooms: action.payload,
        totalPrice: action.payload.reduce(
          (sum, r) => sum + r.price * r.quantity,
          0
        ),
      };
    case "CLEAR_CONSULTATION":
      return {
        ...state,
        consultation: {
          ...state.consultation,
          loading: false,
          data: null,
          success: false,
          error: null,
        },
        hasConsultation: false,
      };
    case "RESET_BOOKING_FORM":
      return {
        ...state,
        bookingForm: {
          checkInDate: "",
          guestCount: "1 Người lớn - 0 Trẻ em",
          fullName: state.bookingForm.fullName || "",
          phoneNumber: state.bookingForm.phoneNumber || "",
          email: state.bookingForm.email || "",
          requirements: "",
          address: state.bookingForm.address || "",
        },
        bookingErrors: {},
        guestCounter: {
          adults: 1,
          children: 0,
          childrenUnder10: 0,
          childrenAbove10: 0,
          isOpen: false,
        },
      };
    case "SET_EDITING_BOOKING_ID":
      return {
        ...state,
        editingBookingId: action.payload,
      };
    case "SET_GUEST_COUNTER":
      return {
        ...state,
        guestCounter: {
          ...state.guestCounter,
          ...action.payload,
        },
      };
    case "SET_ROOM_SERVICES": {
      const { roomId, services } = action.payload;
      const updatedServices = { ...state.selectedYachtServices };
      if (!services || services.length === 0) {
        delete updatedServices[roomId];
      } else {
        updatedServices[roomId] = services;
      }
      return {
        ...state,
        selectedYachtServices: updatedServices,
      };
    }
    case "SET_SELECTED_YACHT_SERVICES":
      return {
        ...state,
        selectedYachtServices: action.payload,
      };
    case "FETCH_SCHEDULES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SCHEDULES_SUCCESS": {
      const { yachtId, schedules: fetchedSchedules } = action.payload;
      const newSchedules = { ...state.schedules };
      if (yachtId && Array.isArray(fetchedSchedules)) {
        newSchedules[yachtId] = fetchedSchedules;
      }
      return {
        ...state,
        loading: false,
        schedules: newSchedules,
      };
    }
    case "FETCH_SCHEDULES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "CLEAR_CURRENT_BOOKING_DETAIL":
      return { ...state, currentBookingDetail: null, bookingSubmitting: false };
    case "SET_SELECTED_ROOM_QUANTITIES":
      return {
        ...state,
        selectedRoomQuantities: action.payload,
      };
    default:
      return state;
  }
};

export default bookingReducer;
