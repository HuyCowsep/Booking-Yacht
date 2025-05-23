import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, Stack } from "@mui/material";
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

export default function Login() {
  // State để lưu trữ thông tin đăng nhập
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  if (showTransition) {
    // Disable scroll
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none"; // Ngăn tương tác luôn
  } else {
    // Enable scroll lại
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  }

  // Cleanup nếu component unmount
  return () => {
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  };
}, [showTransition]);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:9999/api/v1/customers/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("customer", JSON.stringify(response.data.customer));

      setShowTransition(true); //hiện thị hiệu ứng chuyển tiếp bằng logo
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.";
      setError(errorMessage);
    }
  };
  // Hiện thị Logo LongWave trong 1 giây
  if (showTransition) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: (theme) => theme.palette.background.default,
          animation: "fadeIn 0.5s ease-in-out",
          "@keyframes fadeIn": {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="LongWave Logo"
          sx={{
            height: 120,
            mb: 2,
            animation: "pulse 1.5s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: "1.2rem",
            fontWeight: 500,
            animation: "fadeInText 1s ease-in-out",
            "@keyframes fadeInText": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 - Booking Yacht
        </Typography>
      </Box>
    );
  }

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
            backdropFilter: (theme) => (theme.palette.mode === "light" ? "blur(60px)" : "blur(5px)"),
            borderRadius: 3,
            p: 3,
            width: 500,
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
            Đăng nhập
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
                placeholder="Nhập tên đăng nhập của bạn"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
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
                htmlFor="password"
                color="text.primary"
                sx={{ mb: 1, fontSize: "1rem" }}
              >
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
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
            <Box
              className="form-options"
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2 }}
            >
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Ghi nhớ đăng nhập"
                sx={{ color: "text.secondary", "& .MuiTypography-root": { fontSize: "0.9rem" } }}
              />
              <Typography
                component="a"
                href="#"
                color="primary"
                sx={{
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Quên mật khẩu?
              </Typography>
            </Box>
            <StyledButton type="submit">Đăng nhập</StyledButton>
          </Box>
          <Box className="social-login" sx={{ mt: 3 }}>
            <Typography align="center" color="text.secondary" sx={{ mb: 2, fontSize: "0.9rem" }}>
              Hoặc đăng nhập bằng
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
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" style={{ color: "#68bfb5", textDecoration: "none" }}>
              Đăng ký
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
