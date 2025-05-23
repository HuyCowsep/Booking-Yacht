import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Stack, Grid } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import "./Auth.css";

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
}));

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Chuẩn hóa id để khớp với formData
    const field =
      id === "name"
        ? "fullName"
        : id === "phone_number"
        ? "phoneNumber"
        : id === "reg-password"
        ? "password"
        : id === "confirm-password"
        ? "confirmPassword"
        : id;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Kiểm tra định dạng email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không trùng khớp, hãy thử lại!");
      return;
    }
    // Kiểm tra định dạng email
    if (!validateEmail(formData.email)) {
      setError("Email không hợp lệ! Vui lòng nhập email đúng định dạng (ví dụ: example@domain.com).");
      return;
    }
    // Chuẩn bị dữ liệu gửi lên API
    const dataToSend = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      password: formData.password,
    };

    try {
      const response = await axios.post("http://localhost:9999/api/v1/customers/register", dataToSend);
      setSuccess("Đăng ký thành công!");

      // Chuyển hướng về /login và reload sau 1.5 giây
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.";
      setError(errorMessage);
    }
  };

  return (
    <Box
      className="auth-container"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: (theme) =>
          `url(${
            theme.palette.mode === "light"
              ? "https://aicahpl.com/datafiles/24-05-2024/17165153587681_z5457622581893_7a317754dc5b9a8b9c5627b59516d1fb.jpg"
              : "https://aicahpl.com/content_hpl/upload/Image/470686884_1008976914560433_8237905483350125379_n.jpg"
          })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className="auth-form-wrapper">
        <Box
          className="auth-form"
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(27, 36, 42, 0.7)",
            backdropFilter: (theme) => (theme.palette.mode === "light" ? "blur(80px)" : "blur(5px)"),
            borderRadius: 3,
            p: 3,
            width: 600,
            maxWidth: 700,
            boxShadow: (theme) => theme.shadows[1],
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: (theme) =>
                `0 12px 48px ${
                  theme.palette.mode === "light" ? "rgba(129, 127, 127, 0.5)" : "rgba(0, 0, 0, 0.7)"
                }`,
            },
          }}
        >
          <Typography
            variant="h5"
            align="center"
            color="text.primary"
            mb={3}
            sx={{ fontSize: "2rem", fontWeight: "bold" }}
          >
            Đăng ký tài khoản
          </Typography>

          {/* Hiển thị thông báo lỗi hoặc thành công */}
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
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography
                component="label"
                htmlFor="username"
                color="text.primary"
                sx={{ mb: 1, fontSize: "1rem" }}
              >
                Tên đăng nhập
              </Typography>
              <TextField
                fullWidth
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                variant="outlined"
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255, 255, 255, 0.2)",
                    "& input": { color: "white" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="label"
                  htmlFor="email"
                  color="text.primary"
                  sx={{ mb: 1, fontSize: "1rem", display: "block" }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  variant="outlined"
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(255, 255, 255, 0.2)",
                      "& input": { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                    },
                    "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="label"
                  htmlFor="phone_number"
                  color="text.primary"
                  sx={{ mb: 1, fontSize: "1rem", display: "block" }}
                >
                  Số điện thoại
                </Typography>
                <TextField
                  fullWidth
                  id="phone_number"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  variant="outlined"
                  margin="normal"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(255, 255, 255, 0.2)",
                      "& input": { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                    },
                    "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              </Grid>
            </Grid>
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography
                component="label"
                htmlFor="name"
                color="text.primary"
                sx={{ mb: 1, fontSize: "1rem" }}
              >
                Họ và tên
              </Typography>
              <TextField
                fullWidth
                id="name"
                type="text"
                placeholder="Nhập họ và tên"
                variant="outlined"
                margin="normal"
                value={formData.fullName}
                onChange={handleChange}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255, 255, 255, 0.2)",
                    "& input": { color: "white" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />
            </Box>
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography
                component="label"
                htmlFor="address"
                color="text.primary"
                sx={{ mb: 1, fontSize: "1rem" }}
              >
                Địa chỉ
              </Typography>
              <TextField
                fullWidth
                id="address"
                type="text"
                placeholder="Nhập địa chỉ"
                variant="outlined"
                margin="normal"
                value={formData.address}
                onChange={handleChange}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255, 255, 255, 0.2)",
                    "& input": { color: "white" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="label"
                  htmlFor="reg-password"
                  color="text.primary"
                  sx={{ mb: 1, fontSize: "1rem" }}
                >
                  Mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  id="reg-password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  variant="outlined"
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(255, 255, 255, 0.2)",
                      "& input": { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                    },
                    "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="label"
                  htmlFor="confirm-password"
                  color="text.primary"
                  sx={{ mb: 1, fontSize: "1rem" }}
                >
                  Xác nhận mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  id="confirm-password"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  variant="outlined"
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(255, 255, 255, 0.2)",
                      "& input": { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" },
                    },
                    "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              </Grid>
            </Grid>
            <StyledButton type="submit">Đăng ký</StyledButton>
          </Box>
          <Box className="social-login" sx={{ mt: 3 }}>
            <Typography align="center" color="text.secondary" sx={{ mb: 2, fontSize: "0.9rem" }}>
              Hoặc đăng ký bằng
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Button
                className="social-btn google-btn"
                sx={{
                  bgcolor: "#db4437",
                  color: "#fff",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#c1352b" },
                }}
              >
                <FontAwesomeIcon icon={faGoogle} className="icon" style={{ marginRight: "8px" }} />
                Google
              </Button>
              <Button
                className="social-btn facebook-btn"
                sx={{
                  bgcolor: "#4267b2",
                  color: "#fff",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#365899" },
                }}
              >
                <FontAwesomeIcon icon={faFacebookF} className="icon" style={{ marginRight: "8px" }} />
                Facebook
              </Button>
            </Stack>
          </Box>
          <Typography
            align="center"
            color="text.secondary"
            mt={2}
            className="switch-form"
            sx={{ fontSize: "0.9rem" }}
          >
            Bạn đã có tài khoản?{" "}
            <Link to="/login" style={{ color: "#68bfb5", textDecoration: "none" }}>
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
