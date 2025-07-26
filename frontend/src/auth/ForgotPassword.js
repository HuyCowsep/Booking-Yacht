import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "@emotion/styled";
import Swal from "sweetalert2";
import axios from "axios";

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

const ForgotPassword = ({ initialUsername, onBackToLogin, setShowTransition, navigate }) => {
  const [step, setStep] = useState("forgot"); // forgot, otp, reset
  const [username, setUsername] = useState(initialUsername || "");
  const [otp, setOtp] = useState(""); // Lưu OTP từ email
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Theo dõi OTP đã gửi thành công chưa
  const [receivedOtp, setReceivedOtp] = useState(""); // Lưu OTP từ server

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:9999/api/v1/customers/forgot-password", {
        username,
      });
      setReceivedOtp(response.data.otp); // Lưu OTP từ response
      setSuccess(response.data.message);
      setStep("otp");
      setOtpSent(true); // OTP đã gửi thành công, hiển thị nút "Gửi lại"
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi server");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:9999/api/v1/customers/forgot-password", {
        username,
      });
      setReceivedOtp(response.data.otp); // Cập nhật OTP mới
      setSuccess("OTP đã được gửi lại!");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi gửi OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (otp !== receivedOtp) {
        setError("Mã OTP không đúng, vui lòng kiểm tra email của bạn.");
        return;
      }
      const response = await axios.post("http://localhost:9999/api/v1/customers/verify-otp", {
        username,
        otp,
      });
      setSuccess(response.data.message);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi server");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:9999/api/v1/customers/reset-password", {
        username,
        newPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: response.data.message || "Đặt lại mật khẩu thành công!",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setShowTransition(true);
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <>
      <Typography variant="h5" align="center" color="text.primary" mb={3} sx={{ fontSize: "2rem", fontWeight: "bold" }}>
        {step === "forgot" ? "Quên Mật Khẩu" : step === "otp" ? "Nhập OTP" : "Đặt Lại Mật Khẩu"}
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

      <Box
        component="form"
        onSubmit={step === "forgot" ? handleForgotPassword : step === "otp" ? handleVerifyOtp : handleResetPassword}
      >
        {step === "forgot" && (
          <>
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="username" color="text.primary" sx={{ mb: 1, fontSize: "1rem" }}>
                Tên đăng nhập
              </Typography>
              <TextField
                fullWidth
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập của bạn"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <StyledButton type="submit">Gửi OTP</StyledButton>
            <Typography
              align="center"
              color="text.secondary"
              mt={2}
              sx={{ fontSize: "0.9rem", cursor: "pointer" }}
              onClick={onBackToLogin}
            >
              Quay lại đăng nhập
            </Typography>
          </>
        )}
        {step === "otp" && (
          <>
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="otp" color="text.primary" sx={{ mb: 1, fontSize: "1rem" }}>
                Mã OTP
              </Typography>
              <TextField
                fullWidth
                id="otp"
                type="text"
                placeholder="Nhập mã OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
            <StyledButton type="submit">Xác Thực OTP</StyledButton>
            {otpSent && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2} sx={{ fontSize: "0.9rem" }}>
                <Typography color="text.secondary" component="span">
                  Bạn chưa nhận được mã?&nbsp;
                </Typography>
                <Typography
                  onClick={handleResendOtp}
                  component="span"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "underline",
                    textDecorationThickness: "1px",
                    "&:hover": {
                      textDecorationThickness: "2px",
                    },
                  }}
                >
                  Gửi lại OTP
                </Typography>
              </Box>
            )}
            <Typography
              align="center"
              color="text.secondary"
              mt={2}
              sx={{ fontSize: "0.9rem", cursor: "pointer" }}
              onClick={onBackToLogin}
            >
              <ArrowBackIcon />
              Quay lại đăng nhập
            </Typography>
          </>
        )}
        {step === "reset" && (
          <>
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="newPassword" color="text.primary" sx={{ mb: 1, fontSize: "1rem" }}>
                Mật khẩu mới
              </Typography>
              <TextField
                fullWidth
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            <StyledButton type="submit">Đặt Lại Mật Khẩu</StyledButton>
            <Typography
              align="center"
              color="text.secondary"
              mt={2}
              sx={{ fontSize: "0.9rem", cursor: "pointer" }}
              onClick={onBackToLogin}
            >
              Quay lại đăng nhập
            </Typography>
          </>
        )}
      </Box>
    </>
  );
};

export default ForgotPassword;
