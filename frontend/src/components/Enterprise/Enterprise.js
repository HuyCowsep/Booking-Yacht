import React from "react";
import { Paper, Typography, Stack, TextField, MenuItem, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const partnerImages = [
  {
    img: "https://ext.same-assets.com/3589370286/3318790573.png",
    title: "Lịch trình phù hợp với yêu cầu của doanh nghiệp",
    desc: "Du thuyền sẽ sắp xếp lịch trình phù hợp với từng sự kiện của doanh nghiệp: du lịch của công ty tri ân nhân viên, hội thảo hay làm việc với đối tác.",
  },
  {
    img: "https://ext.same-assets.com/3589370286/1746559625.png",
    title: "Đa dạng trong sự lựa chọn các du thuyền",
    desc: "Tùy vào nhu cầu của doanh nghiệp, chúng tôi sẽ tư vấn cung cấp du thuyền phù hợp về: số lượng phòng nghỉ, boong tàu rộng rãi hay chi phí hợp lý.",
  },
  {
    img: "https://ext.same-assets.com/3589370286/995712306.png",
    title: "Thời gian linh hoạt",
    desc: "Chúng tôi sẽ tư vấn thời gian linh hoạt nhất phù hợp với tính chất của sự kiện và lịch làm việc trước và sau chuyến đi của quý doanh nghiệp.",
  },
];

const customerLogos = [
  "https://ext.same-assets.com/3589370286/1475916938.png",
  "https://ext.same-assets.com/3589370286/1216348293.png",
  "https://ext.same-assets.com/3589370286/1658336896.png",
  "https://ext.same-assets.com/3589370286/2956912027.png",
  "https://ext.same-assets.com/3589370286/2169757183.png",
  "https://ext.same-assets.com/3589370286/2544806471.png",
];

const searchOptions = {
  cruise: ["Tất cả du thuyền", "Heritage", "Ambassador", "Grand Pioneers", "Capella"],
  location: ["Tất cả địa điểm", "Vịnh Hạ Long", "Vịnh Lan Hạ", "Cát Bà"],
  guest: ["Tất cả mọi giá", "< 3 triệu", "3-5 triệu", "> 5 triệu"],
};

export default function Enterprise() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.background.default,
        fontFamily: "Roboto, Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Section 1: Banner + Search box */}
      <Box sx={{ position: "relative", zIndex: 1, pt: { md: 5 } }}>
        {/* Search Box */}
        <Paper
          elevation={3}
          sx={{
            py: { xs: 5, md: 7 },
            px: { xs: 1, md: 5 },
            borderRadius: 4,
            minWidth: { xs: "95%", md: 600 },
            maxWidth: 1120,
            height: { xs: 250, md: 250 },
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            top: { xs: -50, md: 0 },
            bgcolor: (theme) => theme.palette.background.paper,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          <Typography variant="h6" fontWeight={700} align="center" sx={{ color: "primary.main" }}>
            Bạn lựa chọn du thuyền Hạ Long nào?
          </Typography>
          <Typography variant="body2" align="center" mb={2} sx={{ color: "text.secondary" }}>
            Hơn 100 tour du thuyền hạng sang, chất lượng tốt sẵn sàng cho bạn chọn
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
            <TextField
              select
              size="small"
              fullWidth
              defaultValue={searchOptions.cruise[0]}
              label="Loại du thuyền"
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
                "& .MuiSelect-icon": { color: "text.primary" },
              }}
            >
              {searchOptions.cruise.map((option) => (
                <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              fullWidth
              defaultValue={searchOptions.location[0]}
              label="Địa điểm"
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
                "& .MuiSelect-icon": { color: "text.primary" },
              }}
            >
              {searchOptions.location.map((option) => (
                <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              fullWidth
              defaultValue={searchOptions.guest[0]}
              label="Mức giá"
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
                "& .MuiSelect-icon": { color: "text.primary" },
              }}
            >
              {searchOptions.guest.map((option) => (
                <MenuItem key={option} value={option} sx={{ color: "text.primary" }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/find-boat"
              onClick={() => window.scrollTo(0, 0)}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                width: { xs: "100%", sm: "auto" },
                py: 1,
                bgcolor: "primary.main",
                color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
                borderRadius: "32px",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Section 2: Content giới thiệu & đặc điểm doanh nghiệp */}
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 2 },
          pt: { xs: 10, md: 14 },
          pb: 6,
          display: "flex",
          gap: { xs: 4, md: 6 },
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >

        <Box sx={{ flex: "1 1 350px", minWidth: 320, maxWidth: 570 }}>
          <Typography
            variant="h2"
            sx={{ color: "text.primary", fontWeight: 700, fontSize: 28, mb: 2, lineHeight: 1.2 }}
          >
            𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 - Tour Du thuyền Hạ Long: <br />
            Kết nối doanh nghiệp, khám phá vẻ đẹp tự nhiên
          </Typography>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: 17,
              lineHeight: 1.7,
              mb: 2.5,
            }}
            fontFamily={"Archivo, sans-serif"}
          >
            Với sự trải nghiệm thực tế, Công ty TNHH Du lịch và Dịch vụ 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 mong muốn đưa du thuyền Hạ Long trở
            thành một lựa chọn đầu tiên cho doanh nghiệp. Nhiều chương trình du lịch hấp dẫn, đa dạng được kết hợp sẽ
            đem đến cho quý doanh nghiệp sự hài lòng và thuận tiện. Du thuyền Hạ Long cũng sẽ là một món quà tri ân vô
            cùng ý nghĩa dành cho nhân viên của quý doanh nghiệp. Bên cạnh đó, du thuyền Hạ Long còn rất phù hợp cho
            những cuộc hội thảo, hợp tác đầu tư hay giao lưu của quý doanh nghiệp.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/lien-he-tu-van"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "primary.main",
              color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
              borderRadius: 26,
              fontWeight: 600,
              fontSize: 16,
              p: "12px 28px",
              boxShadow: (theme) => theme.shadows[1],
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Liên hệ với 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 <span style={{ fontSize: 20 }}>→</span>
          </Button>
        </Box>
        {/* Các box nhỏ bên phải + ảnh */}
        <Box sx={{ flex: "1 1 260px", minWidth: 260, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Lịch trình phù hợp */}
          <Box
            sx={{
              display: "flex",
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: 18,
              boxShadow: (theme) => theme.shadows[1],
              p: 2,
              alignItems: "center",
              gap: 2,
              minWidth: 260,
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <Box
              component="img"
              src={partnerImages[0].img}
              alt="schedule"
              sx={{ width: 62, borderRadius: 10 }}
            />
            <Box>
              <Typography sx={{ fontSize: 16, color: "text.primary", fontWeight: "bold", mb: 1 }}>
                {partnerImages[0].title}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, lineHeight: 1.5 }}>
                {partnerImages[0].desc}
              </Typography>
            </Box>
          </Box>
          {/* Đa dạng du thuyền */}
          <Box
            sx={{
              display: "flex",
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: 18,
              boxShadow: (theme) => theme.shadows[1],
              p: 2,
              alignItems: "center",
              gap: 2,
              minWidth: 260,
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <Box
              component="img"
              src={partnerImages[1].img}
              alt="diverse"
              sx={{ width: 62, borderRadius: 10 }}
            />
            <Box>
              <Typography sx={{ fontSize: 16, color: "text.primary", fontWeight: "bold", mb: 1 }}>
                {partnerImages[1].title}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, lineHeight: 1.5 }}>
                {partnerImages[1].desc}
              </Typography>
            </Box>
          </Box>
          {/* Thời gian linh hoạt */}
          <Box
            sx={{
              display: "flex",
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: 18,
              boxShadow: (theme) => theme.shadows[1],
              p: 2,
              alignItems: "center",
              gap: 2,
              minWidth: 260,
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <Box
              component="img"
              src={partnerImages[2].img}
              alt="flexible"
              sx={{ width: 62, borderRadius: 10 }}
            />
            <Box>
              <Typography sx={{ fontSize: 16, color: "text.primary", fontWeight: "bold", mb: 1 }}>
                {partnerImages[2].title}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, lineHeight: 1.5 }}>
                {partnerImages[2].desc}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Section 3: Khách hàng của 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 */}
      <Box
        sx={{
          mt: 8,
          bgcolor: (theme) => (theme.palette.mode === "light" ? "#eafeff" : "#1b242a"),
          p: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 2 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "66.6666%" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: 28,
                  color: "text.primary",
                }}
              >
                Khách hàng của 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
              </Typography>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "34.3333%" },
                textAlign: { xs: "right", md: "left" },
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontFamily: "Archivo, sans-serif",
                  lineHeight: 1.6,
                  color: "text.primary",
                  fontWeight: 500,
                }}
              >
                𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 mang đến một trải nghiệm hoàn toàn mới, trải nghiệm đẳng cấp 5 sao cho khách hàng
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 3, md: 5 },
              flexWrap: "wrap",
              justifyContent: "center",
              px: { xs: 0, md: "calc(50% - 590px)" },
              maxWidth: 1180,
              mx: "auto",
            }}
          >
            {customerLogos.map((src, i) => (
              <Box
                key={i}
                component="img"
                src={src}
                alt={`logo-${i}`}
                sx={{
                  height: 54,
                  width: "auto",
                  objectFit: "contain",
                  borderRadius: 8,
                  bgcolor: "#fff",
                  p: 1,
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.divider,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
