import React, { useState } from "react";
import { Box, Typography, TextField, Stack } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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

  const customer = JSON.parse(localStorage.getItem("customer"));

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

    try {
      const response = await axios.post("http://localhost:9999/api/v1/customers/change-password", {
        username: customer.username,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

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
      setError(err.response?.data?.message || "Đổi mật khẩu thất bại, vui lòng thử lại.");
    }
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
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="primary.main">
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
          <StyledButton type="submit">Đổi mật khẩu</StyledButton>
        </Stack>
      </Box>
    </Box>
  );
}
