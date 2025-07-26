// AdminProfile.js (sửa logic change password)
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, IconButton } from "@mui/material";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doAdminLogout } from "../../redux/actions/adminActions";
import Swal from "sweetalert2";
import { ArrowBack } from "@mui/icons-material";

export default function AdminProfile({ toggleTheme, mode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.admin.adminAccount.token);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire("Lỗi", "Không có token, vui lòng đăng nhập lại", "error");
      dispatch(doAdminLogout());
      navigate("/admin-login");
      return;
    }

    fetch("http://localhost:9999/api/v1/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        Swal.fire("Lỗi", "Không thể tải profile, vui lòng đăng nhập lại", "error");
        dispatch(doAdminLogout());
        navigate("/admin-login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, token, dispatch]);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire("Lỗi", "Hãy điền đầy đủ thông tin", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Lỗi", "Mật khẩu mới và xác nhận không khớp", "error");
      return;
    }

    setChanging(true);

    fetch("http://localhost:9999/api/v1/admin/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          // Sửa: Check res.ok (status 200-299), nếu không thì throw để vào catch
          return res.json().then((data) => {
            throw new Error(data.message || "Lỗi không xác định");
          });
        }
        return res.json();
      })
      .then((data) => {
        Swal.fire("Thành công", "Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.", "success").then(() => {
          dispatch(doAdminLogout());
          navigate("/admin-login");
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "Unauthorized") {
          Swal.fire("Lỗi", "Phiên hết hạn, đăng nhập lại", "error");
          dispatch(doAdminLogout());
          navigate("/admin-login");
        } else {
          Swal.fire("Lỗi", err.message || "Thay đổi mật khẩu thất bại", "error");
        }
      })
      .finally(() => setChanging(false));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Không có dữ liệu profile
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
      <IconButton onClick={() => navigate("/admin")} sx={{ mb: 2, borderRadius: "20px" }}>
        <ArrowBack />
        <Typography ml={1}>Quay lại Dashboard</Typography>
      </IconButton>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: theme.shadows[2] }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{
            color: "#00ffff",
            textShadow: "1px 1px 2px #000",
            mb: 4,
          }}
        >
          ⚙️ Profile Admin
        </Typography>

        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          {/* Left: Info */}
          <Grid item xs={12} md={10}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "text.primary" }}>
                  👤 Username: <span style={{ color: "#ac67c7", fontWeight: 600 }}>{profile.username}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" sx={{ color: "text.primary", fontWeight: 500 }}>
                  🛡️ Role: <span style={{ color: "#4fc3f7", fontWeight: 600 }}>{profile.roles}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" sx={{ color: "text.primary", fontWeight: 500 }}>
                  Status: <span style={{ color: "#63d406ff", fontWeight: 600 }}>{profile.status}</span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Right: Theme toggle */}
          <Grid item xs={12} md={2} textAlign="right">
            <IconButton onClick={toggleTheme} color="inherit" variant="subtitle1" style={{ borderRadius: "20px" }}>
              <span style={{ fontWeight: 600, marginRight: "20px" }}>Chế độ: </span>
              {mode === "light" ? <AiOutlineMoon size={24} /> : <AiOutlineSun size={24} />}
            </IconButton>
          </Grid>
        </Grid>

        <Typography variant="h6" mt={4} mb={2}>
          Thay đổi mật khẩu
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật khẩu cũ"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              disabled={changing}
              sx={{ mt: 2 }}
            >
              {changing ? <CircularProgress size={24} color="inherit" /> : "Thay đổi"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
