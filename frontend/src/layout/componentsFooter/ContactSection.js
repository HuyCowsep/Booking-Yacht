import React from "react";
import { Box, TextField, Typography, Button, Grid, Paper } from "@mui/material";

export default function ContactSection() {
  return (
    <Box sx={{ width: "100%", pb: 10 }}>
      {/* Google Map - riêng một thẻ */}
      <Box sx={{ width: "100%", height: { xs: 400, md: 500 } }}>
        <iframe
          title="FPT University Hanoi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.191381778225!2d105.5269134153329!3d21.023481393326655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454c9935c7295%3A0x6a0614cf4cb5690f!2sFPT%20University%20Hanoi!5e0!3m2!1sen!2s!4v1684751411111!5m2!1sen!2s"
        ></iframe>
      </Box>

      {/* Contact Form - riêng một thẻ, lấn lên map */}
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
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "text.primary" }}>
            Khám phá Hạ Long thông qua Du thuyền
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Khám phá Hạ Long qua Du thuyền cùng 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 – Hãy liên hệ ngay để trải nghiệm hành trình tuyệt vời!
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.divider,
                    },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                  "& .MuiInputBase-input": { color: "text.primary" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.divider,
                    },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                  "& .MuiInputBase-input": { color: "text.primary" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.divider,
                    },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                  "& .MuiInputBase-input": { color: "text.primary" },
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
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.divider,
                    },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                  "& .MuiInputBase-input": { color: "text.primary" },
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
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