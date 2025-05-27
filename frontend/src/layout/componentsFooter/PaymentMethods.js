import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { max } from "lodash";

export default function PaymentMethods() {
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: 6,
        px: 3,
        padding: 3,
        color: "text.primary",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        border: "1px solid",
        borderColor: "divider",
        fontFamily: "Roboto, Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
        Hình thức thanh toán
      </Typography>

      {/* 1. QR Code */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "text.primary" }}>
        1. Thanh toán trực tuyến bằng mã QR
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Đối với vé máy bay, sau khi đặt vé thành công, quý khách chọn hình thức thanh toán trực tuyến qua QR trên website.
        Khi thanh toán thành công, quý khách sẽ nhận được vé điện tử qua địa chỉ email đã đăng ký.
      </Typography>

      {/* Ảnh QR placeholder */}
      <Card sx={{ maxWidth: 800, my: 2, justifyContent: "center", display: "flex" }}>
        <Grid container>
          <Grid item xs={5}>
            <CardMedia
              component="img"
              height="auto"
              image="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ThisIsJustADemo"
              alt="QR Code demo"
              sx={{ p: 2 }}
            />
          </Grid>
          <Grid item xs={7}>
            <CardContent>
              <Typography variant="body3" color="text.secondary">
                Tên người nhận: HuyCowsep - Nguyễn Đức Huy<br />
                Ngân hàng: MB Bank (Ngân hàng quân đội)<br />
                Số tài khoản: 3863 666 889 666<br />
                Nội dung chuyển khoản: Mã đơn hàng - Họ tên<br />
                Ví dụ: 123456 - Nguyễn Văn A chuyển khoản<br />
                Thời gian xử lý: Trong vòng 30 phút sau khi thanh toán thành công!
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* 2. Chuyển khoản ngân hàng */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "text.primary" }}>
        2. Thanh toán bằng chuyển khoản ngân hàng
      </Typography>
      <Typography sx={{ color: "text.secondary", whiteSpace: "pre-line" }}>
        Tên tài khoản: Công ty TNHH Du lịch và dịch vụ 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮{"\n"}
        Số tài khoản: 3863666898666{"\n"}
        Tại: Ngân hàng TMCP Quân đội – MB Bank{"\n"}
        Chi nhánh: Chi nhánh Hoàng Quốc Việt
      </Typography>

      {/* 3. Thanh toán trực tiếp tại văn phòng */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "text.primary" }}>
        3. Thanh toán tại văn phòng của 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
      </Typography>
      <Typography sx={{ color: "text.secondary", whiteSpace: "pre-line" }}>
        Địa chỉ: Số nhà 25 – Ngõ 38 – Phố Yên Lãng – Phường Láng Hạ – Quận Đống Đa – Thành phố Hà Nội – Việt Nam{"\n"}
        Số điện thoại hotline: 0912 202 885{"\n"}
        Giờ làm việc: 9h00 – 17h30 (từ thứ 2 – đến thứ 6){"\n"}
        và 9h00 – 12h00 (thứ 7)
      </Typography>
    </Box>
  );
}
