export const validateBookingForm = (formData) => {
  const errors = {};

  if (!formData.fullName?.trim()) {
    errors.fullName = "Họ và tên là bắt buộc";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
  }

  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = "Số điện thoại là bắt buộc";
  } else if (
    !/^(?:\+84|0)(3[2-9]|5[6-9]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(
      formData.phoneNumber.trim()
    )
  ) {
    errors.phoneNumber =
      "Số điện thoại phải bắt đầu bằng 0 hoặc +84, theo sau là đầu số hợp lệ (03, 05, 07, 08, 09) và 7 chữ số, tổng cộng 10 chữ số";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email là bắt buộc";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = "Email không hợp lệ";
  }

  if (!formData.checkInDate) {
    errors.checkInDate = "Ngày check-in là bắt buộc";
  } else {
    const selectedDate = new Date(
      formData.checkInDate.split("/").reverse().join("-")
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.checkInDate = "Ngày check-in không thể là ngày trong quá khứ";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateRoomSelection = (rooms, selectedSchedule) => {
  const errors = {};

  if (!selectedSchedule) {
    errors.schedule = "Vui lòng chọn lịch trình";
  }

  const selectedRooms = rooms.filter((room) => room.quantity > 0);
  if (selectedRooms.length === 0) {
    errors.rooms = "Vui lòng chọn ít nhất một phòng";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export function formatPrice(value) {
  if (typeof value !== "number" || isNaN(value)) return "0 ₫";
  return value.toLocaleString("vi-VN") + " ₫";
}

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch (error) {
    return "Không xác định";
  }
};

export const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email);
};

export const isValidPhone = (phone) => {
  return /^(?:\+84|0)(3[2-9]|5[6-9]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(phone);
};
