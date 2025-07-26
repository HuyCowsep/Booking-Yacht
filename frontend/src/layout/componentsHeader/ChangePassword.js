import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styled from "@emotion/styled";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Thêm useSelector

const StyledButton = styled("button")(({ theme }) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "1rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: "none",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Lấy customer và token từ Redux
  const customer = useSelector((state) => state.account.account.customer);
  const token = useSelector((state) => state.account.account.data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation: Kiểm tra mật khẩu mới không được giống mật khẩu cũ
    if (formData.newPassword === formData.oldPassword) {
      setError("Đây là mật khẩu cũ, bạn hãy chọn mật khẩu khác nhé.");
      return;
    }

    // Validation: Kiểm tra mật khẩu mới và xác nhận khớp
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (!customer) {
      setError("Vui lòng đăng nhập để đổi mật khẩu.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9999/api/v1/customers/change-password",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      Swal.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công!",
        text: "Bạn sẽ được chuyển hướng về trang chủ.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate("/");
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Đổi mật khẩu thất bại, vui lòng thử lại."
      );
    }
  };

  const handleCancel = () => {
    // Reset form và quay về trang trước (hoặc trang chủ)
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
    navigate(-1); // Quay lại trang trước đó
  };

  if (!customer) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="primary.main">
          Vui lòng đăng nhập để đổi mật khẩu.
        </Typography>
      </Box>
    );
  }

  if (!customer.accountId) {
    return (
      <Box
        sx={{
          p: 4,
          m: 2,
          borderRadius: 2,
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          color: "#856404",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          height: "450px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 40, color: "#ffc107" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
          Tài khoản đăng nhập bằng Google không thể đổi mật khẩu.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom color="primary.main">
        Đổi mật khẩu
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

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Mật khẩu cũ"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Mật khẩu mới"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2}>
            <StyledButton type="submit">Đổi mật khẩu</StyledButton>
            <Button
              variant="outlined"
              color="secondary"
              style={{ height: "48px" }}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}