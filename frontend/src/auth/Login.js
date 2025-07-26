import styled from "@emotion/styled";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { doLogin } from "../redux/actions/userAction";
import { loginApi } from "../services/ApiServices";
import "./Auth.css";
import ForgotPassword from "./ForgotPassword";

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
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTransition, setShowTransition] = useState(false);
  const [step, setStep] = useState("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showTransition) {
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, [showTransition]);

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
  setLoading(true);
  try {
    if (!formData.username || !formData.password) {
      setLoading(false);
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const res = await loginApi(formData.username.trim(), formData.password.trim());
    console.log("Login API response:", res); // Debug full response

    // Kiểm tra response từ /api/v1/accounts/login
    if (!res.success || !res.data || !res.data.token) {
      setLoading(false);
      setError("Tài khoản hoặc mật khẩu không đúng");
      return;
    }

    const { token, customer, idCompany } = res.data; // Lấy trực tiếp từ res.data
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    const role = decoded.role;

    // Dispatch với customer object
    dispatch(doLogin(token, role, idCompany || "", customer?._id || "", customer));
    console.log("Dispatch doLogin with:", { token, role, idCompany, customer }); // Debug

    setShowTransition(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "COMPANY") {
        navigate("/manage-company");
      } else if (role === "CUSTOMER") {
        navigate("/");
      } else {
        setError("Tài khoản không hợp lệ hoặc không có quyền truy cập.");
        navigate("/");
      }
    }, 1500);
  } catch (err) {
    setLoading(false);
    setError(
      err.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại."
    );
    console.error("Login error:", err); // Debug lỗi
  }
};

const handleGoogleLoginSuccess = async (credentialResponse) => {
  setError("");
  setSuccess("");
  try {
    const response = await axios.post(
      "http://localhost:9999/api/v1/customers/google-login",
      {
        token: credentialResponse.credential,
      }
    );
    localStorage.setItem("token", response.data.token);
    // Không cần setItem("customer") vì dùng Redux
    const token = response.data.token;
    const customer = response.data.customer;
    const decoded = jwtDecode(token);
    const role = decoded.role || "CUSTOMER";  // Default cho Google

    // Dispatch với customer object (idCustomer = customer._id)
    dispatch(doLogin(token, role, "", customer._id, customer));

    setSuccess("Đăng nhập bằng Google thành công!");
    setShowTransition(true);
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1500);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Đăng nhập bằng Google thất bại, vui lòng thử lại."
    );
  }
};

  const handleGoogleLoginFailure = () => {
    setError("Đăng nhập bằng Google thất bại, vui lòng thử lại.");
  };

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
          alt="𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 Logo"
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
    <GoogleOAuthProvider clientId="886283594702-6h7nch0gouk0kq0dn6gcf9qfm8eq3don.apps.googleusercontent.com">
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
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(27, 36, 42, 0.7)",
              backdropFilter: (theme) =>
                theme.palette.mode === "light" ? "blur(60px)" : "blur(5px)",
              borderRadius: 3,
              p: 3,
              width: 500,
              maxWidth: 700,
              boxShadow: (theme) => theme.shadows[1],
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: (theme) =>
                  `0 12px 48px ${
                    theme.palette.mode === "light"
                      ? "rgba(129, 127, 127, 0.5)"
                      : "rgba(0, 0, 0, 0.7)"
                  }`,
              },
            }}
          >
            {step === "login" ? (
              <>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.primary"
                  mb={3}
                  sx={{ fontSize: "2rem", fontWeight: "bold" }}
                >
                  Đăng nhập
                </Typography>

                {error && (
                  <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                {success && (
                  <Typography
                    color="success.main"
                    align="center"
                    sx={{ mb: 2 }}
                  >
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
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
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
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    className="form-options"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      my: 2,
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox color="primary" />}
                      label="Ghi nhớ đăng nhập"
                      sx={{
                        color: "text.secondary",
                        "& .MuiTypography-root": { fontSize: "0.9rem" },
                      }}
                    />
                    <Typography
                      color="primary"
                      sx={{
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => {
                        setStep("forgotPassword");
                        setError("");
                        setSuccess("");
                      }}
                    >
                      Quên mật khẩu?
                    </Typography>
                  </Box>
                  <StyledButton type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </StyledButton>
                </Box>

                <Box className="social-login" sx={{ mt: 3 }}>
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 2, fontSize: "0.9rem" }}
                  >
                    Hoặc đăng nhập bằng
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    mt={2}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                    />
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
                  <Link
                    to="/register"
                    style={{ color: "#68bfb5", textDecoration: "none" }}
                  >
                    Đăng ký
                  </Link>
                </Typography>
              </>
            ) : (
              <ForgotPassword
                initialUsername={formData.username}
                onBackToLogin={() => {
                  setStep("login");
                  setError("");
                  setSuccess("");
                }}
                navigate={navigate}
              />
            )}
          </Box>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
}
