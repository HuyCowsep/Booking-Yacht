export const fetchRoomsRequest = () => ({ type: "FETCH_ROOMS_REQUEST" });
export const setConsultationRequest = (value) => ({
  type: "SET_CONSULTATION_REQUEST",
  payload: value,
});
export const fetchSchedulesRequest = () => ({
  type: "FETCH_SCHEDULES_REQUEST",
});
export const fetchSchedulesSuccess = (schedules) => ({
  type: "FETCH_SCHEDULES_SUCCESS",
  payload: schedules,
});
export const setCurrentBookingId = (bookingId) => ({
  type: "SET_CURRENT_BOOKING_ID",
  payload: bookingId,
});
export const fetchSchedulesFailure = (error) => ({
  type: "FETCH_SCHEDULES_FAILURE",
  payload: error,
});
export const fetchRoomsSuccess = (rooms, schedules, yachtId) => ({
  type: "FETCH_ROOMS_SUCCESS",
  payload: { rooms, schedules, yachtId },
});
export const fetchRoomsFailure = (error) => ({
  type: "FETCH_ROOMS_FAILURE",
  payload: error,
});
export const incrementRoomQuantity = (roomId) => ({
  type: "INCREMENT_ROOM_QUANTITY",
  payload: roomId,
});
export const decrementRoomQuantity = (roomId) => ({
  type: "DECREMENT_ROOM_QUANTITY",
  payload: roomId,
});
export const setEditingBookingId = (bookingId) => ({
  type: "SET_EDITING_BOOKING_ID",
  payload: bookingId,
});
export const setSelectedSchedule = (scheduleId) => ({
  type: "SET_SELECTED_SCHEDULE",
  payload: scheduleId,
});
export const setSelectedMaxPeople = (maxPeople) => ({
  type: "SET_SELECTED_MAX_PEOPLE",
  payload: maxPeople,
});
export const updateBookingForm = (field, value) => ({
  type: "UPDATE_BOOKING_FORM",
  payload: { field, value },
});
export const setMaxPeopleOptions = (options) => ({
  type: "SET_MAX_PEOPLE_OPTIONS",
  payload: options,
});
export const setGuestCounterOpen = (isOpen) => ({
  type: "SET_GUEST_COUNTER_OPEN",
  payload: isOpen,
});
export const updateAdults = (increment) => ({
  type: "UPDATE_ADULTS",
  payload: increment,
});
export const updateChildren = (increment) => ({
  type: "UPDATE_CHILDREN",
  payload: increment,
});
export const clearSelection = () => ({ type: "CLEAR_SELECTION" });
export const resetBookingForm = () => ({ type: "RESET_BOOKING_FORM" });
export const clearCurrentBookingDetail = () => ({
  type: "CLEAR_CURRENT_BOOKING_DETAIL",
});
export const genericBookingRequest = () => ({
  type: "GENERIC_BOOKING_REQUEST",
});
export const genericBookingSuccess = (bookingData) => ({
  type: "GENERIC_BOOKING_SUCCESS",
  payload: bookingData,
});
export const genericBookingFailure = (error) => ({
  type: "GENERIC_BOOKING_FAILURE",
  payload: error,
});
export const confirmConsultationRequest = () => ({
  type: "CONFIRM_CONSULTATION_REQUEST",
});
export const confirmConsultationSuccess = (bookingData) => ({
  type: "CONFIRM_CONSULTATION_SUCCESS",
  payload: bookingData,
});
export const confirmConsultationFailure = (error) => ({
  type: "CONFIRM_CONSULTATION_FAILURE",
  payload: error,
});
export const setBookingErrors = (errors) => ({
  type: "SET_BOOKING_ERRORS",
  payload: errors,
});
export const requestConsultation = (consultationData) => ({
  type: "REQUEST_CONSULTATION",
  payload: consultationData,
});
export const setFormValidation = (field, isValid, errorMessage) => ({
  type: "SET_FORM_VALIDATION",
  payload: { field, isValid, errorMessage },
});
export const clearAllErrors = () => ({ type: "CLEAR_ALL_ERRORS" });
export const fetchCustomerBookingsRequest = () => ({
  type: "FETCH_CUSTOMER_BOOKINGS_REQUEST",
});
export const fetchCustomerBookingsSuccess = (bookings) => ({
  type: "FETCH_CUSTOMER_BOOKINGS_SUCCESS",
  payload: bookings,
});
export const fetchCustomerBookingsFailure = (error) => ({
  type: "FETCH_CUSTOMER_BOOKINGS_FAILURE",
  payload: error,
});
export const fetchBookingDetailRequest = () => ({
  type: "FETCH_BOOKING_DETAIL_REQUEST",
});
export const fetchBookingDetailSuccess = (bookingDetail) => ({
  type: "FETCH_BOOKING_DETAIL_SUCCESS",
  payload: bookingDetail,
});
export const fetchBookingDetailFailure = (error) => ({
  type: "FETCH_BOOKING_DETAIL_FAILURE",
  payload: error,
});
export const updateBookingStatusInList = (bookingId, status) => ({
  type: "UPDATE_BOOKING_STATUS_IN_LIST",
  payload: { bookingId, status },
});
export const updateRooms = (rooms) => ({
  type: "UPDATE_ROOMS",
  payload: rooms,
});
export const clearConsultation = () => ({ type: "CLEAR_CONSULTATION" });
export const setGuestCounter = (payload) => ({
  type: "SET_GUEST_COUNTER",
  payload,
});
export const setRoomServices = (roomId, services) => ({
  type: "SET_ROOM_SERVICES",
  payload: { roomId, services },
});
export const setSelectedYachtServices = (services) => ({
  type: "SET_SELECTED_YACHT_SERVICES",
  payload: services,
});
export const setSelectedRoomQuantities = (roomQuantities) => ({
  type: "SET_SELECTED_ROOM_QUANTITIES",
  payload: roomQuantities,
});
