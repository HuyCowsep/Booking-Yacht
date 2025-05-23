import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const menuLinks = [
  { label: "Tìm du thuyền", href: "/find-boat" },
  { label: "Khách sạn", href: "/hotel" },
  { label: "Doanh nghiệp", href: "/doanh-nghiep" },
  { label: "Blog", href: "/blog" },
];

export default function Header({ toggleTheme, mode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin customer từ localStorage khi component mount
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setCustomer(null);

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
            color="primary"
            fontWeight={700}
            fontFamily="'Pacifico', cursive"
            fontSize={35}
            component={Link}
            to="/"
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
            <Typography fontSize={19} color="text.secondary">
              <b>Hotline: </b>0123456789
            </Typography>
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
              <MenuItem disabled>
                <Typography fontSize={14} color="text.secondary" ml={1}>
                  <b>Hotline:</b> 0123456789
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Login/Register/Theme Toggle hoặc Welcome/Logout/Theme Toggle */}
        <Stack direction="row" spacing={1} ml={3} alignItems="center">
          {customer ? (
            <>
              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                Xin chào, {customer.fullName}!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleLogout}
                sx={{ borderRadius: 20, textTransform: "none" }}
              >
                Đăng xuất
              </Button>
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
            </>
          )}
          <IconButton onClick={toggleTheme} color="inherit" sx={{ p: 1 }}>
            {mode === "light" ? <AiOutlineMoon size={24} /> : <AiOutlineSun size={24} />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
