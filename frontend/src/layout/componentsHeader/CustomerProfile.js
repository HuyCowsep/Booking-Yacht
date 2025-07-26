import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Avatar, Stack, IconButton, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import Swal from "sweetalert2";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useSelector, useDispatch } from "react-redux";
import { isValidPhone, isValidEmail } from "../../redux/validation";
import { updateCustomerProfile } from "../../redux/actions/userAction";

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "1rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  position: "relative",
}));

const Input = styled("input")({
  display: "none",
});

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const reduxCustomer = useSelector((state) => state.account.account.customer);
  const token = useSelector((state) => state.account.account.data);

  useEffect(() => {
    if (reduxCustomer) {
      setCustomer(reduxCustomer);
      setFormData({
        fullName: reduxCustomer.fullName || "",
        email: reduxCustomer.email || "",
        phoneNumber: reduxCustomer.phoneNumber || "",
        avatar: reduxCustomer.avatar || null,
      });
    }
  }, [reduxCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!isValidPhone(formData.phoneNumber)) {
      Swal.fire({
        icon: "error",
        title:
          "Số điện thoại phải bắt đầu bằng 0 hoặc +84, theo sau là đầu số hợp lệ (03, 05, 07, 08, 09) và 7 chữ số, tổng cộng 10 chữ số",
        text: "Vui lòng kiểm tra lại số điện thoại của bạn.",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
      return;
    }

    if (!customer) {
      setError("Vui lòng đăng nhập để cập nhật thông tin.");
      setIsLoading(false);
      return;
    }

    try {
      const updateData = { phoneNumber: formData.phoneNumber };
      if (customer.accountId) {
        updateData.fullName = formData.fullName;
        updateData.email = formData.email;
      }

      const updateResponse = await axios.put(`http://localhost:9999/api/v1/customers/${customer._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let updatedAvatar = customer.avatar;
      if (customer.accountId && formData.avatar && formData.avatar instanceof File) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", formData.avatar);
        const avatarResponse = await axios.put(
          `http://localhost:9999/api/v1/customers/${customer._id}/avatar`,
          avatarFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        updatedAvatar = avatarResponse.data.customer.avatar; // Lấy URL mới từ Cloudinary
      }

      const updatedCustomer = {
        ...customer,
        fullName: customer.accountId ? formData.fullName : customer.fullName,
        phoneNumber: formData.phoneNumber,
        email: updateResponse.data.customer.email,
        avatar: updatedAvatar,
        id: customer._id,
      };

      // Dispatch action để cập nhật Redux
      dispatch(updateCustomerProfile(updatedCustomer));

      setCustomer(updatedCustomer);
      setSuccess("Cập nhật thông tin thành công!");
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Thông tin cá nhân đã được cập nhật.",
        confirmButtonText: "OK",
      });
      setEditMode(false);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật thông tin thất bại, vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  if (!customer) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="primary.main">
          Vui lòng đăng nhập để xem thông tin cá nhân.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom color="primary.main">
        Thông tin cá nhân
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" align="center" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}

      {/* Avatar + Upload */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Avatar
            src={formData.avatar instanceof File ? URL.createObjectURL(formData.avatar) : formData.avatar || ""}
            alt="Avatar"
            sx={{ width: 120, height: 120 }}
          />
          {editMode && customer.accountId && (
            <label htmlFor="avatar-upload">
              <Input accept="image/*" id="avatar-upload" type="file" onChange={handleAvatarChange} />
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          )}
        </Stack>
      </Box>

      {/* 📝 Luôn hiển thị form, chỉ khác nhau ở trạng thái editable hay không */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode || !customer.accountId}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            disabled={!editMode || !customer.accountId}
            error={editMode && customer.accountId && !isValidEmail(formData.email)}
            helperText={
              editMode && customer.accountId && !isValidEmail(formData.email)
                ? "Email không hợp lệ, cần Email chính xác để 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 gửi các thông tin như chọn phòng, gửi hoá đơn,..."
                : ""
            }
          />

          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            error={editMode && !isValidPhone(formData.phoneNumber)}
            helperText={
              editMode && !isValidPhone(formData.phoneNumber)
                ? "Số điện thoại không hợp lệ, nếu sai sẽ không nhận được mã OTP"
                : ""
            }
          />

          {editMode ? (
            <Stack direction="row" spacing={2}>
              <StyledButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span>Đang xử lý</span>
                    <CircularProgress size={24} style={{ color: "white" }} />
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </StyledButton>
              <Button
                variant="outlined"
                color="secondary"
                style={{ height: "52px" }}
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    fullName: customer.fullName || "",
                    email: customer.email || "",
                    phoneNumber: customer.phoneNumber || "",
                    avatar: customer.avatar || null,
                  });
                  setError("");
                  setSuccess("");
                }}
              >
                Hủy
              </Button>
            </Stack>
          ) : (
            <StyledButton onClick={() => setEditMode(true)}>Chỉnh sửa thông tin</StyledButton>
          )}
        </Stack>
      </Box>

      {/* Thông báo lưu ý nếu là Google account */}
      {!editMode && !customer.accountId && (
        <Typography variant="body2" color="error" sx={{ fontStyle: "italic", textAlign: "center", mt: 2 }}>
          * Đối với người dùng đăng nhập bằng Google, bạn chỉ có thể cập nhật số điện thoại. Việc chỉnh sửa họ tên,
          email và ảnh đại diện sẽ không được hỗ trợ để đảm bảo tính nhất quán với thông tin từ Google.
        </Typography>
      )}
    </Box>
  );
}
