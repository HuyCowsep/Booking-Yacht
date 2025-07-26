import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { AiFillPhone, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { doLogout } from "../redux/actions/userAction";

const menuLinks = [
  { label: "Tìm du thuyền", href: "/find-boat" },
  { label: "Doanh nghiệp", href: "/doanh-nghiep" },
  { label: "Blog", href: "/blog" },
];

export default function Header({ toggleTheme, mode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const customer = useSelector((state) => {
    console.log("Redux state.account:", state.account);
    return state.account.account.customer;
  }); // Lấy trực tiếp customer từ Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(doLogout());
    localStorage.removeItem("token"); // Xóa token
    // Không cần remove "customer" vì Redux persist sẽ xử lý
    Swal.fire({
      icon: "success",
      title: "Đăng xuất thành công!",
      text: "𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 xin cảm ơn và hẹn gặp lại!",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      willClose: () => {
        navigate("/");
      },
    });
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 0, py: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Box component="img" src="/images/logo.png" alt="LongWave Logo" sx={{ height: 80, mr: 2 }} />
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight={700}
            fontFamily="'Pacifico', cursive"
            fontSize={35}
            sx={{
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
          </Typography>
        </Box>

        {/* Menu */}
        {!isMobile ? (
          <Stack direction="row" spacing={2} alignItems="center">
            {menuLinks.map((link) => (
              <Button
                href={link.href}
                key={link.label}
                color="inherit"
                sx={{
                  fontWeight: 500,
                  fontSize: 18,
                  lineHeight: "24px",
                  textTransform: "none",
                  "&:hover": {
                    color: "text.secondary",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}

            {/* Nút gọi hotline desktop */}
            <Button
              startIcon={<AiFillPhone />}
              onClick={() => {
                Swal.fire({
                  title: "Mở ứng dụng gọi?",
                  text: "Bạn có muốn gọi đến số hotline: 0912202885",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Gọi ngay 📞",
                  cancelButtonText: "Đóng",
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.href = "tel:0912202885";
                  }
                });
              }}
              sx={{
                fontWeight: 500,
                fontSize: 18,
                lineHeight: "24px",
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Hotline: 0912202885
            </Button>
          </Stack>
        ) : (
          <>
            <IconButton size="large" edge="end" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {menuLinks.map((link) => (
                <MenuItem key={link.label} onClick={handleMenuClose} component={Link} to={link.href}>
                  {link.label}
                </MenuItem>
              ))}

              {/* Hotline trên mobile - có thể ấn gọi */}
              <MenuItem
                onClick={() => {
                  Swal.fire({
                    title: "Mở ứng dụng gọi?",
                    text: "Bạn có muốn gọi đến số hotline: 0912202885",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Gọi ngay 📞",
                    cancelButtonText: "Đóng",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.href = "tel:0912202885";
                    }
                  });
                  handleMenuClose();
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AiFillPhone size={18} />
                  <Typography fontSize={14} color="text.secondary">
                    <b>Hotline:</b> 0912202885
                  </Typography>
                </Stack>
              </MenuItem>
            </Menu>
          </>
        )}

        {/* User Menu hoặc Login/Register */}
        <Stack direction="row" spacing={1} ml={3} alignItems="center">
          {customer ? (
            <>
              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                Xin chào, {customer.fullName || customer.username} {/* Ưu tiên fullName nếu có, fallback username */}
              </Typography>
              <IconButton onClick={handleUserMenuOpen}>
                <Avatar
                  src={customer.avatar || ""}
                  alt={customer.fullName || customer.username}
                  sx={{ width: 32, height: 32 }}
                />
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                anchorEl={userAnchorEl}
                open={Boolean(userAnchorEl)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleUserMenuClose} component={Link} to="/view-profile">
                  Xem trang cá nhân
                </MenuItem>
                <MenuItem onClick={handleUserMenuClose} component={Link} to="/booking-history">
                  Lịch sử booking
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    toggleTheme();
                    handleUserMenuClose();
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Đổi chế độ</Typography>
                    {mode === "light" ? <AiOutlineMoon size={20} /> : <AiOutlineSun size={20} />}
                  </Stack>
                </MenuItem>
                <MenuItem
                  onClick={handleUserMenuClose}
                  component={Link}
                  to="/change-password"
                  disabled={!customer.accountId}
                  sx={{
                    color: !customer.accountId ? "text.disabled" : "text.primary",
                    "&.Mui-disabled": { color: "text.disabled" },
                  }}
                >
                  Đổi mật khẩu
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleUserMenuClose();
                  }}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                component={Link}
                to="/login"
                sx={{ borderRadius: 20, textTransform: "none" }}
                startIcon={<LoginIcon />}
              >
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                component={Link}
                to="/register"
                sx={{ borderRadius: 20, textTransform: "none" }}
                startIcon={<PersonAddIcon />}
              >
                Đăng ký
              </Button>
              <IconButton onClick={toggleTheme} color="inherit" sx={{ p: 1 }}>
                {mode === "light" ? <AiOutlineMoon size={24} /> : <AiOutlineSun size={24} />}
              </IconButton>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
