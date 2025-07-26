import axios from "../utils/axiosClient";

export const deleteYacht = (idYacht) => {
  return axios.put(`/api/v1/yachts/delete/${idYacht}`, {isDeleted: false});
};

export const getAllLocation = () => {
  return axios.get("api/v1/locations/getAllLocation");
};

export const getYachtByIdCompany = (idCompany) => {
  return axios.get(`/api/v1/yachts/${idCompany}`);
};

export const getYachtByIdYacht = (yachtId) => {
  return axios.get(`/api/v1/yachts/findboat/${yachtId}`);
};

export const getYachtType = () => {
  return axios.get("api/v1/yachtTypes/getYachtType");
};

export const getFeedbackCompany = (idCompany) => {
  return axios.get(`/api/companies/feedBackByIdCompany/${idCompany}`);
};

export const confirmBooking = (idCompany, idBookingOrder) => {
  return axios.put(`/api/companies/${idCompany}/confirm/${idBookingOrder}`);
};

export const getBookingByAmount = (idCompany, min, max) => {
  return axios.get(`/api/companies/bookingOrders/range/${idCompany}`, {
    params: {
      min: min,
      max: max,
    },
  });
};

export const getBookingOrder = (idCompany) => {
  return axios.get(`/api/v1/bookings/company`, {
    params: { idCompany },
  });
};

export const getProfileCompany = (idCompany) => {
  return axios.get(`/api/v1/companies/info/${idCompany}`);
};

export const deleteYachtImage = (idImage) => {
  return axios.delete(`/api/v1/yachtImage/deleteImage/${idImage}`);
};

export const getYachtImage = (idYacht) => {
  return axios.get(`/api/v1/yachtImage/image/${idYacht}`);
};

export const createServiceYacht = (yachtId, serviceName, price) => {
  const data = {
    serviceName: serviceName,
    price: Number(price), // Chuyển thành number
    yachtId: yachtId,
  };
  return axios.post(`/api/v1/yachts/add-service`, data);
};

export const deleteServiceYacht = (idYacht, idService) => {
  return axios.delete(`/api/companies/deleteYachtService/${idYacht}/${idService}`);
};

export const getServiceByYacht = (yachtId) => {
  return axios.get(`/api/v1/services/yachts/${yachtId}/services`);
};

export const createScheduleYacht = (startDate, endDate, yachtId) => {
  return axios.post("/api/v1/yachts/add-schedule", {
    startDate,
    endDate,
    yachtId,
  });
};

export const deleteScheduleYacht = (yachtId, scheduleId) => {
  return axios.delete(`/api/companies/deleteSchedule/${yachtId}/${scheduleId}`);
};

export const getScheduleYacht = (yachtId) => {
  return axios.get(`/api/v1/yachts/${yachtId}/schedules`);
};

export const getAllRoomByYacht = (idYacht) => {
  return axios.get(`/api/v1/rooms/room/all-by-yacht?yachtId=${idYacht}`);
};

export const getAllRoomTypeCompany = (yachtId) => {
  return axios.get(`/api/v1/rooms/roomtype/all-by-yacht?yachtId=${yachtId}`);
};

export const updateYacht = (
  idYacht,
  name,
  image,
  hullBody,
  description,
  rule,
  itinerary,
  idYachtType,
  idLocation,
  maxRoom
) => {
  const data = new FormData();
  data.append("name", name);
  data.append("image", image);
  data.append("hullBody", hullBody);
  data.append("description", description);
  data.append("rule", rule);
  data.append("itinerary", itinerary);
  data.append("idYachtType", idYachtType);
  data.append("idLocation", idLocation);
  data.append("maxRoom", maxRoom);
  return axios.put(`/api/v1/yachts/updateYacht/${idYacht}`, data);
};

export const exportBookingOrder = (idCompany, month, year) => {
    let params = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return axios.get(`/api/v1/companies/export/${idCompany}${query}`, { responseType: 'blob' });
};

export const getAllBooking = (idCompany, month, year) => {
  return axios.get("/api/v1/companies/total-booking-stats", {
    params: {
      idCompany: idCompany,
      month: month,
      year: year,
    },
  });
};

export const getBookingByYear = (idCompany, year) => {
  return axios.get("/api/v1/companies/booking-by-year", {
    params: {
      idCompany: idCompany,
      year: year,
    },
  });
};

export const getStatisticBooking = (idCompany, month, year) => {
  return axios.get("/api/v1/companies/revenue/booking", {
    params: {
      idCompany: idCompany,
      month: month,
      year: year,
    },
  });
};

export const getStatisticService = (idCompany, month, year) => {
  return axios.get("/api/v1/companies/revenue/service", {
    params: {
      idCompany: idCompany,
      month: month,
      year: year,
    },
  });
};

export const upadteServiceYacht = (idYacht, idService, service, price) => {
  const data = new FormData();
  data.append("service", service);
  data.append("price", price);
  return axios.put(`/api/companies/updateYachtService/${idYacht}/${idService}`, data);
};

export const updateScheduleYacht = (yachtId, scheduleId, startDate, endDate) => {
  return axios.put(`/api/v1/yachts/updateSchedule/${yachtId}/${scheduleId}`, {
    startDate: startDate,
    endDate: endDate,
  });
};

export const updateRoomType = (roomTypeId, price, type, utilities) => {
  const data = new FormData();
  data.append("price", price);
  data.append("type", type);
  data.append("utilities", utilities);
  return axios.put(`/api/v1/rooms/roomtype/update/${roomTypeId}`, data);
};

export const updateRoom = (roomId, description, roomName, avatar, quantity) => {
  const data = new FormData();
  data.append("description", description);
  data.append("roomName", roomName);
  data.append("avatar", avatar);
  data.append("quantity", quantity);
  return axios.put(`/api/v1/rooms/updateRoom/${roomId}`, data);
};

export const updateProfileCompany = (idCompany, name, address, email, logo) => {
  const data = new FormData();
  data.append("name", name);
  data.append("address", address);
  data.append("email", email);
  if (logo && logo instanceof File) {
    data.append("logo", logo);
  }

  return axios.put(`/api/v1/companies/profile/${idCompany}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateYachtImage = (idImage, image) => {
  const data = new FormData();
  data.append("image", image);
  return axios.put(`/api/v1/yachtImage/updateImage/${idImage}`, data);
};

export const updateImageRoom = (idImage, image) => {
  const data = new FormData();
  data.append("image", image);
  return axios.put(`/api/companies/roomImage/updateImage/${idImage}`, data);
};

export const createRoomType = (price, type, utilities, yachtId) => {
  const data = new FormData();
  data.append("type", type);
  data.append("utility", utilities);
  data.append("price", price);
  data.append("yachtId", yachtId);
  return axios.post(`/api/v1/rooms/roomtype/create`, data);
};

export const deleteRoomType = (roomTypeId) => {
  return axios.delete(`/api/v1/rooms/roomtype/delete/${roomTypeId}`);
};

export const canelBooking = (idCompany, idBookingOrder, reason) => {
  const data = new FormData();
  data.append("reason", reason);
  return axios.put(`/api/companies/${idCompany}/cancel/${idBookingOrder}`, data);
};

export const createImageRoom = (idRoom, image) => {
  const data = new FormData();
  data.append("image", image);
  return axios.post(`/api/companies/roomImage/insertImage/${idRoom}`, data);
};

export const deleteImageRoom = (idImage) => {
  return axios.delete(`/api/companies/roomImage/deleteImage/${idImage}`);
};

export const getImageByRoom = (roomId) => {
  return axios.get(`/api/companies/roomImage/getAllImageByIdRoom/${roomId}`);
};

export const createYacht = (
  name,
  image,
  launch,
  hullBody,
  description,
  rule,
  itinerary,
  yachtTypeId,
  locationId,
  IdCompanys,
  maxRoom
) => {
  const data = new FormData();
  data.append("name", name);
  data.append("image", image);
  data.append("launch", launch);
  data.append("hullBody", hullBody);
  data.append("description", description);
  data.append("rule", rule);
  data.append("itinerary", itinerary);
  data.append("yachtTypeId", yachtTypeId);
  data.append("locationId", locationId);
  data.append("IdCompanys", IdCompanys);
  data.append("maxRoom", maxRoom);
  return axios.post(`/api/v1/yachts/insertYacht`, data);
};

export const createRoom = (roomName, area, description, roomType, avatar, idYacht, quantity) => {
  const data = new FormData();
  data.append("roomName", roomName);
  data.append("area", area);
  data.append("description", description);
  data.append("idRoomType", roomType);
  data.append("avatar", avatar); // file
  data.append("idYacht", idYacht);
  data.append("quantity", quantity);
  return axios.post(`/api/v1/rooms/room/create`, data);
};

export const createYachtImage = (idYacht, images) => {
  const data = new FormData();
  data.append("image", images);
  return axios.post(`/api/v1/yachtImage/addImage/${idYacht}`, data);
};

export const changePasswordCompany = (idCompany, oldPassword, newPassword, confirmPassword) => {
  const data = new FormData();
  data.append("oldPassword", oldPassword);
  data.append("newPassword", newPassword);
  data.append("confirmPassword", confirmPassword);
  return axios.put(`/api/companies/profiles/changePassword/${idCompany}`, data);
};

export const loginApi = async (username, password) => {
  return await axios.post("/api/v1/accounts/login", { username, password });
};

export const companyCompleteBooking = (bookingId) => {
  return axios.put(`/api/v1/bookings/company/${bookingId}/complete`);
};

export const companyCancelBooking = (bookingId) => {
  return axios.put(`/api/v1/bookings/company/${bookingId}/cancel`);
};

export const confirmFullPaymentBooking = (bookingId) => {
  return axios.put(`/api/v1/bookings/${bookingId}/confirm-full-payment`);
};

// Calendar Schedules API (Company)
export const getCompanyCalendarSchedules = (yachtId) => {
  // Nếu có yachtId thì truyền lên query, không thì lấy tất cả
  return axios.get("/company/calendar-schedules", {
    params: yachtId ? { yachtId } : {},
  });
};

export const createCompanyCalendarSchedule = (data) => {
  // data: { title, description, start, end, yachtId, type, color, ... }
  return axios.post("/company/calendar-schedules", data);
};

export const updateCompanyCalendarSchedule = (id, data) => {
  return axios.put(`/company/calendar-schedules/${id}`, data);
};

export const deleteCompanyCalendarSchedule = (id) => {
  return axios.delete(`/company/calendar-schedules/${id}`);
};

// Cập nhật trạng thái ẩn/hiện (isDeleted) cho du thuyền
export const updateYachtStatus = (idYacht, isDeleted) => {
    return axios.put(`/api/v1/yachts/delete/${idYacht}`, { isDeleted });
}
