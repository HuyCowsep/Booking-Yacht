import React from "react";
import { Box, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: 6,
        px: 3,
        color: "text.primary",
        padding: 3,
        bgcolor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[3],
        fontFamily: "Roboto, Arial, sans-serif",
        lineHeight: 1.6,
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
        Chính sách quyền riêng tư
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        I. Chính sách quyền riêng tư:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Chúng tôi đánh giá cao sự tin tưởng của quý khách trong việc chọn Longwave cho dịch vụ đặt phòng  trực tuyến của bạn. Chính vì vậy, chúng tôi sẽ giữ gìn và bảo vệ sự riêng tư và kín đáo của các chi tiết cá nhân cho quý khách một cách kịp thời và cẩn trọng.
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Chính sách an toàn và bảo mật này áp dụng cho tất cả các dịch vụ của chúng tôi (bao gồm cả dịch vụ du thuyền Hạ Long, Resort).
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        1. Mục đích thu thập thông tin của khách hàng:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Website Longwave.com thu thập thông tin khách hàng phục vụ cho việc cung cấp dịch vụ, tour du lịch, vé Resort cho khách hàng. Đặc biệt, việc thu thập thông tin này rất cần thiết để hỗ trợ sau mua cho khách hàng.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        2. Phạm vi thu thập thông tin của khách hàng:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Chúng tôi thu thập các thông tin cá nhân như Họ tên, số điện thoại, email theo yêu cầu cung cấp thông tin của các hãng hàng không khi tiến hành đặt và xuất vé. Hoặc thông tin khách hàng được cung cấp cho các đơn vị du thuyền Hạ Long để đăng ký với Ban Quản lý Vịnh Hạ Long và phục vụ tour du lịch.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        3. Phạm vi sử dụng thông tin:
      </Typography>
      <Typography component="ul" sx={{ color: "text.secondary" }}>
        <li>Đặt vé, cung cấp thông tin khách hàng cho các hãng hàng không.</li>
        <li>Cung cấp thông tin khách hàng cho đơn vị du thuyền, đăng ký với Ban Quản lý Vịnh Hạ Long.</li>
        <li>Liên lạc và giải quyết các vấn đề như thay đổi chuyến bay, giờ bay.</li>
        <li>Trao đổi thông tin khi khách hàng đặt dịch vụ du lịch.</li>
        <li>Chăm sóc khách hàng, tư vấn khi cần thiết.</li>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        4. Thời gian lưu trữ thông tin:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Việc lưu trữ thông tin là không có giới hạn nhằm phục vụ việc kiểm tra lại dữ liệu khi có yêu cầu của hãng hàng không hoặc đơn vị cung cấp dịch vụ.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        5. Những người hoặc tổ chức được tiếp cận với thông tin:
      </Typography>
      <Typography component="ul" sx={{ color: "text.secondary" }}>
        <li>Quản lý website.</li>
        <li>Các hãng hàng không và đơn vị du thuyền Hạ Long.</li>
        <li>Cơ quan nhà nước có thẩm quyền khi có yêu cầu.</li>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        6. Đơn vị thu thập thông tin:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        - Công ty TNHH Du lịch và dịch vụ Longwave<br />
        - Địa chỉ: Số nhà 25, ngõ 38, phố Yên Lãng, phường Láng Hạ, quận Đống Đa, TP Hà Nội.<br />
        - Điện thoại: 0922 222 016<br />
        - Email: info@longwave.com
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Nếu quý khách phát hiện thông tin cá nhân bị sử dụng sai mục đích, vui lòng liên hệ hotline hoặc gửi email cùng bằng chứng để chúng tôi xử lý trong vòng 24h.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        7. Phương tiện và công cụ tiếp cận, chỉnh sửa dữ liệu:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Do thông tin được lưu trên hệ thống nội bộ, khách hàng không thể chỉnh sửa trên website. Quý khách có thể liên hệ qua hotline hoặc email để được hỗ trợ.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        8. Cam kết bảo mật thông tin:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Chúng tôi cam kết bảo mật tuyệt đối theo chính sách bảo mật được đăng tải. Không sử dụng hoặc tiết lộ thông tin cho bên thứ ba nếu không có sự đồng ý của khách hàng, trừ trường hợp pháp luật yêu cầu.
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Trường hợp máy chủ bị tấn công dẫn đến mất dữ liệu, chúng tôi sẽ thông báo và phối hợp xử lý với cơ quan chức năng, đồng thời thông báo đến khách hàng.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        II. Chính sách Cookie:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Cookie là tệp thông tin nhỏ giúp phân tích lưu lượng truy cập hoặc ghi nhớ thông tin người dùng. Chúng tôi sử dụng cookie để cải thiện dịch vụ và trải nghiệm người dùng. Bạn có thể chọn chấp nhận hoặc từ chối cookie qua cài đặt trình duyệt.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        III. Các đường liên kết (link):
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Website Longwave có thể chứa liên kết đến website khác. Chính sách quyền riêng tư của chúng tôi không áp dụng cho các website đó. Vui lòng tham khảo chính sách của bên thứ ba khi truy cập.
      </Typography>

      <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}>
        (*)Hiệu lực áp dụng: Nếu có sự khác biệt giữa các Điều khoản và Điều kiện với Chính sách Quyền riêng tư này, Chính sách Quyền riêng tư sẽ được ưu tiên áp dụng.
      </Typography>
    </Box>
  );
}
