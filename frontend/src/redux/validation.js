export const validateBookingForm = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Họ và tên là bắt buộc";
  }

  if (!formData.phoneNumber.trim()) {
    errors.phoneNumber = "Số điện thoại là bắt buộc";
  } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
    errors.phoneNumber = "Số điện thoại không hợp lệ";
  }

  if (!formData.email.trim()) {
    errors.email = "Email là bắt buộc";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = "Email không hợp lệ";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
export const validateReviewForm = ({
  userRating,
  fullName,
  description,
  customerId,
  yachtId,
}) => {
  if (!userRating || userRating < 1 || userRating > 5) {
    return {
      isValid: false,
      errorMessage: "Vui lòng chọn số sao từ 1 đến 5.",
    };
  }
  if (!fullName) {
    return {
      isValid: false,
      errorMessage: "Họ và tên không được để trống.",
    };
  }
  if (!description) {
    return {
      isValid: false,
      errorMessage: "Vui lòng nhập nhận xét.",
    };
  }
  if (!customerId) {
    return {
      isValid: false,
      errorMessage: "Thông tin khách hàng không hợp lệ.",
    };
  }
  if (!yachtId) {
    return {
      isValid: false,
      errorMessage: "Yacht ID không hợp lệ.",
    };
  }
  return { isValid: true, errorMessage: "" };
};
