import React, { useState, useEffect } from "react";
import { Box, Typography, Link as MuiLink, Grid, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";
import { Fab } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Fade from "@mui/material/Fade";

const BackToTopButton = styled(Fab)`
  position: fixed;
  bottom: 50px;
  right: 30px;
  z-index: 1000;
  color: white;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const scrollDuration = 500;
    const scrollStep = -window.scrollY / (scrollDuration / 16);
    let scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 16);
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        color: "text.primary",
        pt: 6,
        pb: 2,
      }}
    >
      <Box maxWidth={1250} mx="auto" px={0}>
        <Grid container spacing={3}>
          {/* Cột 1: Logo và thông tin công ty */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={2}
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Box component="img" src="/images/logo.png" alt="Logo 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮" sx={{ height: 60 }} />
              <Typography variant="h4" fontWeight={600} color="primary.main">
                𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Công ty TNHH Du Lịch và Dịch Vụ 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
              <br />
              Toà nhà Delta-314, Km29 Đại học FPT, khu CNC Hoà Lạc, huyện Thạch Thất, TP. Hà Nội
              <br />
              Mã số doanh nghiệp: AAAAAAAAAAAA do Sở KHĐT TP Hà Nội cấp ngày 05/06/2023
            </Typography>
          </Grid>

          {/* Cột 2: Các thông tin liên kết */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" mb={1} fontWeight={700} color="text.primary">
              Thông tin
            </Typography>
            <Stack spacing={0.5}>
              <MuiLink href="/ve-chung-toi" color="inherit" underline="hover">
                Về chúng tôi
              </MuiLink>
              <MuiLink href="/dieu-khoan-va-dieu-kien" color="inherit" underline="hover">
                Điều khoản & Điều kiện
              </MuiLink>
              <MuiLink href="/chinh-sach-rieng-tu" color="inherit" underline="hover">
                Chính sách riêng tư
              </MuiLink>
              <MuiLink href="/huong-dan-su-dung" color="inherit" underline="hover">
                Hướng dẫn sử dụng
              </MuiLink>
              <MuiLink href="/hinh-thuc-thanh-toan" color="inherit" underline="hover">
                Hình thức thanh toán
              </MuiLink>
              <MuiLink href="/lien-he-tu-van" color="inherit" underline="hover">
                Liên hệ tư vấn
              </MuiLink>
            </Stack>
          </Grid>

          {/* 🆕 Cột 3: Du Thuyền */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" mb={1} fontWeight={700} color="text.primary">
              Du Thuyền
            </Typography>
            <Stack spacing={0.5}>
              <MuiLink href="/blog" color="inherit" underline="hover">
                Blog
              </MuiLink>
              <MuiLink href="/quy-dinh-chung-va-luu-y" color="inherit" underline="hover">
                Quy định chung và lưu ý
              </MuiLink>
              <MuiLink href="/cau-hoi-thuong-gap" color="inherit" underline="hover">
                Các câu hỏi thường gặp
              </MuiLink>
            </Stack>
          </Grid>

          {/* Cột 4: Liên hệ và logo Bộ Công thương */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" mb={1} fontWeight={700} color="text.primary">
              Liên hệ
            </Typography>
            <Typography variant="body3" color="text.secondary">
              Hotline: 0912 202 885
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: huyndhe176876@fpt.edu.vn
            </Typography>
            <Box
              component="img"
              src="/images/logo-bo-cong-thuong.png"
              alt="Đã thông báo Bộ Công thương"
              sx={{ height: 75, width: 200, mt: 2 }}
            />
          </Grid>
        </Grid>
        <Box textAlign="center" mt={6} sx={{ opacity: 0.7 }}>
          <Typography fontSize={14} color="text.primary" fontWeight="bold">
            &copy; 2025 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮. Bản quyền thuộc về 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮. Đã đăng ký bản quyền. Thiết kế bởi WDP301 - Group 4
          </Typography>
        </Box>
      </Box>

      <Fade in={showButton}>
        <BackToTopButton color="primary" onClick={scrollToTop}>
          <ArrowUpwardIcon />
        </BackToTopButton>
      </Fade>
    </Box>
  );
}
