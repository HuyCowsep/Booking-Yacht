// AdminDashboard.js (chỉ thêm import useNavigate, và sửa MenuItem Profile để navigate)
import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
  Badge,
  Menu,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  AttachMoney,
  CalendarToday,
  Dashboard as DashboardIcon,
  ChevronLeft,
  ChevronRight,
  Logout,
  Home,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import CompanyManagement from "./CompanyManagement";
import RevenueSummary from "./RevenueSummary";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import mới
import { doAdminLogout } from "../../redux/actions/adminActions";

export default function Dashboard({ toggleTheme, mode }) {
  const [open, setOpen] = useState(true);
  const drawerWidthOpen = 240;
  const drawerWidthClosed = 72;
  const drawerWidth = open ? drawerWidthOpen : drawerWidthClosed;
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [companyCount, setCompanyCount] = useState(0);
  const [earningsByMonth, setEarningsByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearOptions, setYearOptions] = useState([]);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3); // demo
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Thêm mới

  // Thêm biến tính vị trí left cho button
  const buttonLeft = (open ? drawerWidthOpen : drawerWidthClosed) - 15;

  useEffect(() => {
    setLoadingCompany(true);
    fetch("http://localhost:9999/api/v1/account-companies/count")
      .then((res) => res.json())
      .then((data) => setCompanyCount(data.count))
      .finally(() => setLoadingCompany(false));
  }, []);

  useEffect(() => {
    setLoadingStats(true);
    fetch("http://localhost:9999/api/v1/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    setLoadingRevenue(true);
    fetch("http://localhost:9999/api/v1/account-companies/revenue/monthly")
      .then((res) => res.json())
      .then((data) => {
        setEarningsByMonth(data);
      })
      .finally(() => setLoadingRevenue(false));
  }, []);

  useEffect(() => {
    if (earningsByMonth.length > 0) {
      const years = Array.from(new Set(earningsByMonth.map((row) => row.year))).sort((a, b) => b - a);
      setYearOptions(years);
      if (!years.includes(selectedYear)) setSelectedYear(years[0]);
    }
  }, [earningsByMonth]);

  const filteredData = earningsByMonth.filter((row) => row.year === selectedYear);
  const totalCommission = filteredData.reduce((sum, row) => sum + row.earnings * 0.05, 0);

  // Avatar menu
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // hàm xử lý nút đăng xuất
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn đăng xuất?",
      text: "Hành động này sẽ kết thúc phiên làm việc.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      dispatch(doAdminLogout());
      navigate("/admin-login");
      await Swal.fire({
        title: "Đã đăng xuất",
        text: "Hẹn gặp lại bạn sau!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor={theme.palette.background.default} fontFamily="'Inter', sans-serif">

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 1201,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: theme.palette.background.paper,
            borderRight: "none",
            borderRadius: open ? "0 24px 24px 0" : "0 16px 16px 0",
            boxShadow: theme.shadows[2],
            transition: "width 0.3s",
            top: 0,
            left: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 0,
          },
        }}
      >
        <Box>
          <Toolbar
            sx={{
              px: 2,
              justifyContent: open ? "space-between" : "center",
              minHeight: 64,
            }}
          >
            {!open && <Avatar src="/icons/logo192.png" sx={{ width: 36, height: 36 }} />}
            {open && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" color={theme.palette.primary.main} fontWeight={700}>
                  Quản Trị Viên
                </Typography>
              </Box>
            )}
          </Toolbar>
          <Divider
            sx={{
              height: 0.004,
              backgroundColor: theme.palette.text.primary,
              opacity: 0.5,
              my: 2,
            }}
          />
          <List>
            {/* Dashboard */}
            <ListItem disablePadding>
              <Tooltip title="Dashboard" placement="right" arrow disableHoverListener={open ? true : false}>
                <ListItemButton
                  selected={selectedMenu === "dashboard"}
                  onClick={() => setSelectedMenu("dashboard")}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s, color 0.2s",
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.text.primary,
                      boxShadow: theme.shadows[2],
                    },
                    "&:hover": {
                      bgcolor: theme.palette.primary.lighter,
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon color={selectedMenu === "dashboard" ? "primary" : "action"} />
                  </ListItemIcon>
                  {open && <ListItemText primary="Dashboard" />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {/* Company */}
            <ListItem disablePadding>
              <Tooltip title="Quản lý công ty" placement="right" arrow disableHoverListener={open ? true : false}>
                <ListItemButton
                  selected={selectedMenu === "company"}
                  onClick={() => setSelectedMenu("company")}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s, color 0.2s",
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.text.primary,
                      boxShadow: theme.shadows[2],
                    },
                    "&:hover": {
                      bgcolor: theme.palette.primary.lighter,
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle color={selectedMenu === "company" ? "primary" : "action"} />
                  </ListItemIcon>
                  {open && <ListItemText primary="Company" />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            
            {/* Revenue */}
            <ListItem disablePadding>
              <Tooltip title="Doanh thu" placement="right" arrow disableHoverListener={open ? true : false}>
                <ListItemButton
                  selected={selectedMenu === "revenue"}
                  onClick={() => setSelectedMenu("revenue")}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s, color 0.2s",
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.text.primary,
                      boxShadow: theme.shadows[2],
                    },
                    "&:hover": {
                      bgcolor: theme.palette.primary.lighter,
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <ListItemIcon>
                    <AttachMoney color={selectedMenu === "revenue" ? "primary" : "action"} />
                  </ListItemIcon>
                  {open && <ListItemText primary="Doanh thu" />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {/* Giao diện Khách hàng */}
            <ListItem disablePadding>
              <Tooltip title="Giao diện Khách Hàng" placement="right" arrow disableHoverListener={open ? true : false}>
                <ListItemButton
                  selected={selectedMenu === "home"}
                  onClick={() => {
                    setSelectedMenu("home");
                    window.open("/", "_blank");
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: "background 0.2s, color 0.2s",
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.text.primary,
                      boxShadow: theme.shadows[2],
                    },
                    "&:hover": {
                      bgcolor: theme.palette.primary.lighter,
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <ListItemIcon>
                    <Home color={selectedMenu === "home" ? "primary" : "action"} />
                  </ListItemIcon>
                  {open && <ListItemText primary="Giao diện Khách Hàng" />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        </Box>

        {/* Logout at bottom */}
        <Box mb={2}>
          <Divider sx={{ my: 1 }} />
          <Tooltip title="Đăng xuất" placement="right" arrow disableHoverListener={open ? true : false}>
            <ListItemButton sx={{ borderRadius: 2, mx: 1 }} onClick={handleLogout}>
              <ListItemIcon>
                <Logout color="action" />
              </ListItemIcon>
              {open && <ListItemText primary="Đăng xuất" />}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>
      <IconButton
        color="primary"
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          top: 68,
          left: `${buttonLeft}px`,
          zIndex: 2002,
          bgcolor: theme.palette.background.paper,
          boxShadow: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 0.1,
          transition: "left 0.3s",
        }}
        className="!shadow-lg hover:!shadow-2xl hover:!bg-gray-400"
      >
        {open ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>

      {/* Main content + Header */}
      <Box flexGrow={1} minHeight="100vh" display="flex" flexDirection="column">
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.paper,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
            borderBottom: `1px solid ${theme.palette.divider}`,
            zIndex: 20,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography
                variant="h6"
                fontWeight="800"
                color={theme.palette.primary.main}
                letterSpacing={1}
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Paper
                component="form"
                sx={{
                  p: "2px 8px",
                  display: "flex",
                  alignItems: "center",
                  width: { xs: 120, sm: 200, md: 250 },
                  borderRadius: 99,
                  bgcolor: theme.palette.background.default,
                  boxShadow: "none",
                }}
              >
                <Tooltip title="Tìm kiếm">
                  <SearchIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                </Tooltip>
                <InputBase
                  placeholder="Tìm kiếm..."
                  sx={{
                    flex: 1,
                    color: theme.palette.text.primary,
                    fontSize: 15,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </Paper>
              <Tooltip title={mode === "light" ? "Chuyển sang dark mode" : "Chuyển sang light mode"}>
                <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.primary, p: 1 }}>
                  {mode === "light" ? <AiOutlineMoon size={24} /> : <AiOutlineSun size={24} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Thông báo">
                <IconButton color="primary">
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Tài khoản">
                <IconButton onClick={handleAvatarClick}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 36,
                      height: 36,
                    }}
                    src="/icons/avatar.png"
                  >
                    A
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/profile'); }}>Profile</MenuItem> {/* Sửa ở đây */}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Box flexGrow={1} p={4} overflow="auto" sx={{ backgroundColor: theme.palette.background.default }}>
          {selectedMenu === "dashboard" && (
            <>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      borderRadius: theme.shape.borderRadius * 0.4,
                      boxShadow: theme.shadows[2],
                      p: 1,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      minHeight: 170,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.03)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent sx={{ width: "100%" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                            Khách hàng
                          </Typography>
                          <Typography variant="h4" color={theme.palette.error.main} fontWeight={700}>
                            {loadingStats ? (
                              <CircularProgress size={28} color="inherit" />
                            ) : stats ? (
                              stats.customer
                            ) : (
                              "..."
                            )}
                          </Typography>
                          <Typography variant="body2" color={theme.palette.text.secondary}>
                            Cập nhật:{" "}
                            {new Date().toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.dark,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <AccountCircle color="primary" fontSize="large" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      borderRadius: theme.shape.borderRadius * 0.4,
                      boxShadow: theme.shadows[2],
                      p: 1,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      minHeight: 170,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.03)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent sx={{ width: "100%" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                            Tất cả công ty
                          </Typography>
                          <Typography variant="h4" color={theme.palette.primary.main} fontWeight={700}>
                            {loadingCompany ? <CircularProgress size={28} color="inherit" /> : companyCount}
                          </Typography>
                          <Typography variant="body2" color={theme.palette.text.secondary}>
                            Cập nhật:{" "}
                            {new Date().toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.error.light,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <CalendarToday color="error" fontSize="large" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      borderRadius: theme.shape.borderRadius * 0.4,
                      boxShadow: theme.shadows[2],
                      p: 1,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      minHeight: 170,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.03)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent sx={{ width: "100%" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                            Thu nhập (Hoa hồng)
                          </Typography>
                          <Typography variant="h4" color={theme.palette.primary.main} fontWeight={700}>
                            {loadingRevenue ? (
                              <CircularProgress size={28} color="inherit" />
                            ) : (
                              totalCommission.toLocaleString()
                            )}{" "}
                            đ
                          </Typography>
                          <Typography variant="body2" color={theme.palette.text.secondary}>
                            Cập nhật:{" "}
                            {new Date().toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.dark,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <AttachMoney color="primary" fontSize="large" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Chart */}
              <Box
                mt={10}
                display="flex"
                justifyContent="center"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  p: 3,
                  my: 4,
                }}
              >
                <Box width="100%" maxWidth={1400}>
                  <Typography variant="h6" fontWeight={600} mb={2} color={theme.palette.text.primary}>
                    Thu nhập và hoa hồng theo tháng
                  </Typography>
                  <Box
                    mb={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    <FormControl size="small">
                      <InputLabel sx={{ color: theme.palette.text.primary }}>Năm</InputLabel>
                      {yearOptions.length > 0 ? (
                        <Select
                          value={yearOptions.includes(selectedYear) ? selectedYear : yearOptions[0]}
                          label="Năm"
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          sx={{
                            minWidth: 100,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: theme.shape.borderRadius,
                            },
                          }}
                        >
                          {yearOptions.map((y) => (
                            <MenuItem key={y} value={y} sx={{ color: theme.palette.text.primary }}>
                              {y}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Select value="" label="Năm" disabled sx={{ minWidth: 100 }} />
                      )}
                    </FormControl>
                  </Box>
                  {loadingRevenue ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                      <CircularProgress size={48} />
                    </Box>
                  ) : filteredData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart
                        data={filteredData.map((row) => ({
                          ...row,
                          commission: row.earnings * 0.05,
                        }))}
                        margin={{ left: 80, right: 80, top: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="month" stroke={theme.palette.text.primary} />
                        <YAxis
                          yAxisId="left"
                          label={{
                            value: "Earnings (đ)",
                            angle: -90,
                            position: "outsideLeft",
                            dx: -76,
                            style: {
                              textAnchor: "middle",
                              fontSize: 12,
                              color: theme.palette.text.primary,
                            },
                          }}
                          stroke={theme.palette.text.primary}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          label={{
                            value: "Commission (đ)",
                            angle: -90,
                            position: "outsideRight",
                            dx: 60,
                            style: {
                              textAnchor: "middle",
                              fontSize: 12,
                              color: theme.palette.text.primary,
                            },
                          }}
                          stroke={theme.palette.text.primary}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 4,
                          }}
                          itemStyle={{ color: theme.palette.text.primary }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="earnings"
                          fill={theme.palette.primary.main || "#1976d2"}
                          name="Booking Earnings"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="commission"
                          stroke={
                            theme.palette.purple ? theme.palette.purple.main : theme.palette.secondary.main || "#9c27b0"
                          }
                          strokeWidth={3}
                          dot
                          name="Commission (5%)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="text.secondary" align="center" py={4}>
                      Không có dữ liệu cho năm này.
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}

          {selectedMenu === "company" && <CompanyManagement />}
          {selectedMenu === "revenue" && <RevenueSummary data={earningsByMonth} />}
          {selectedMenu === "home" && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              minHeight={400}
              color={theme.palette.text.secondary}
              fontStyle="italic"
              fontSize={50}
            >
              Đã mở giao diện khách hàng ở trong Tab mới.
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}