import React, { useState } from "react";
import { Box, TextField, Typography, Button, Grid, Paper } from "@mui/material";
import Swal from "sweetalert2";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error khi đang nhập
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{9,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email để chúng tôi liên hệ lại tư vấn cho bạn";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.message.trim()) newErrors.message = "Vui lòng nhập nội dung";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      Swal.fire({
        icon: "success",
        title: "🎉 Gửi thành công!",
        text: "Cảm ơn bạn đã liên hệ với 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮!",
        confirmButtonText: "Đóng",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        setFormData({ name: "", phone: "", email: "", message: "" });
        setErrors({});
      });
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 10 }}>
      <Box sx={{ width: "100%", height: { xs: 400, md: 500 } }}>
        <iframe
          title="FPT University Hanoi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.506216904078!2d105.52271427596939!3d21.012421688338158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2sFPT%20University!5e0!3m2!1sen!2s!4v1753542652285!5m2!1sen!2s"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>

      <Box
        sx={{
          mt: { xs: -10, md: -12 },
          px: 2,
          maxWidth: 700,
          mx: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: (theme) => theme.palette.background.paper,
            textAlign: "center",
            boxShadow: (theme) => theme.shadows[3],
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
            Khám phá Hạ Long thông qua Du thuyền
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
            Khám phá Hạ Long qua Du thuyền cùng 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 – Hãy liên hệ ngay để trải nghiệm hành trình tuyệt vời!
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": { borderColor: (theme) => theme.palette.divider },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                value={formData.phone}
                onChange={handleChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": { borderColor: (theme) => theme.palette.divider },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": { borderColor: (theme) => theme.palette.divider },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung"
                variant="outlined"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange("message")}
                error={!!errors.message}
                helperText={errors.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": { borderColor: (theme) => theme.palette.divider },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              mt: 3,
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              px: 5,
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Liên hệ với 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 →
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
