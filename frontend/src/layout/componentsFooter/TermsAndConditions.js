import React from "react";
import { Box, Typography } from "@mui/material";

export default function TermsAndConditions() {
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: 6,
        px: 3,
        padding: 3,
        color: "text.primary",
        bgcolor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[3],
        fontFamily: "Roboto, Arial, sans-serif",
        lineHeight: 1.6,
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "text.primary" }}>
        Điều khoản và Điều kiện
      </Typography>

      <Typography paragraph sx={{ color: "text.secondary" }}>
        Website này thuộc quyền sở hữu và quản lý của Công ty TNHH Du lịch và dịch vụ 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮. Khi truy cập và sử dụng website này, bạn đồng ý rằng đã đọc và hiểu các điều khoản và điều kiện dưới đây. Vui lòng đọc kỹ trước khi tiếp tục.
      </Typography>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
        1. Điều khoản chung:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        <strong style={{ color: "text.primary" }}>1.1. Đồng ý với các điều khoản sử dụng:</strong><br />
        Khi sử dụng Website thương mại điện tử 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com (“Website”), Quý khách mặc nhiên chấp thuận các điều khoản và điều kiện sử dụng (“Điều kiện sử dụng”) được quy định dưới đây. Quý khách nên thường xuyên kiểm tra để cập nhật các thay đổi. Chúng tôi có quyền thay đổi hoặc điều chỉnh Điều kiện sử dụng bất cứ lúc nào. Việc Quý khách tiếp tục sử dụng sau các thay đổi đồng nghĩa với việc Quý khách chấp thuận các thay đổi đó.
      </Typography>

      <Typography paragraph sx={{ color: "text.secondary" }}>
        <strong style={{ color: "text.primary" }}>1.2. Các thông tin hiển thị:</strong><br />
        Nội dung trên Website nhằm cung cấp thông tin về du thuyền Vịnh Hạ Long, chuyến bay, giờ bay, giá vé của các hãng hàng không trong nước và quốc tế, dịch vụ vận chuyển hành khách, hành lý, hàng hóa, dịch vụ khách sạn cũng như các dịch vụ bổ trợ liên quan đến du lịch, lữ hành từ nhiều Nhà cung cấp khác nhau (“Nhà cung cấp”).
      </Typography>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
        2. Chính sách bảo hành/bảo trì:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Sản phẩm giao dịch giữa 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com và khách hàng là dịch vụ, do đó không áp dụng chính sách bảo hành hoặc bảo trì.
      </Typography>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
        3. Miễn trừ trách nhiệm:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com và các Nhà cung cấp từ chối trách nhiệm về các lỗi vận hành, an toàn, gián đoạn hay đảm bảo về tính chính xác, đầy đủ, kịp thời của thông tin hiển thị. Khi truy cập website, Quý khách đồng ý rằng 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮, Nhà cung cấp và đối tác liên kết không chịu trách nhiệm cho các thiệt hại, khiếu kiện hay tổn hại trực tiếp hoặc gián tiếp phát sinh từ:
      </Typography>
      <Typography component="div" sx={{ pl: 2, color: "text.secondary" }}>
        a. Việc sử dụng thông tin trên website<br />
        b. Kết nối truy cập từ website<br />
        c. Đăng ký thành viên, nhận thư điện tử hay tham gia chương trình khách hàng thường xuyên<br />
        d. Các hạn chế liên quan đến đặt chỗ trực tuyến.
      </Typography>

      <Typography paragraph sx={{ color: "text.secondary" }}>
        Các điều kiện và hạn chế trên có hiệu lực trong khuôn khổ pháp luật hiện hành.
      </Typography>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
        4. Thông tin về sản phẩm và dịch vụ:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        <strong style={{ color: "text.primary" }}>4.1 Du thuyền Vịnh Hạ Long:</strong><br />
        - Dịch vụ nghỉ dưỡng trên du thuyền là sản phẩm dịch vụ, không áp dụng các chính sách dùng thử, bảo hành hay bảo trì.<br />
        - Các dịch vụ đặt phòng không được hoàn hoặc hủy, chỉ có thể đổi ngày nếu còn phòng tương tự hoặc trả thêm phí chênh lệch.<br />
        - Trường hợp thời tiết xấu hoặc lệnh cấm của Ban Quản lý Vịnh Hạ Long, khách có thể đổi ngày theo thỏa thuận.
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        <strong style={{ color: "text.primary" }}>4.2 Vé máy bay:</strong><br />
        Vé máy bay sẽ được gửi tới email đăng ký sau khi thanh toán. Nếu không nhận được vé, vui lòng liên hệ hotline 0922 222 016 hoặc email huyndhe176876@fpt.edu.vn để được hỗ trợ.<br />
        Mọi yêu cầu thay đổi hoặc hoàn vé vui lòng liên hệ hotline hoặc email hỗ trợ.
      </Typography>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
        5. Trách nhiệm của Ban quản lý website:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        - Cam kết cung cấp nội dung và thông tin chính xác từ Nhà cung cấp.<br />
        - Tư vấn, giải đáp thắc mắc nhanh chóng và chính xác.<br />
        - Bảo mật thông tin khách hàng.<br />
        - Tuân thủ quy định pháp luật về thanh toán, quảng cáo, bảo vệ quyền người tiêu dùng và các quy định khác liên quan.
      </Typography>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
        6. Nghĩa vụ của khách hàng khi sử dụng website:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Khách hàng phải cung cấp đầy đủ thông tin chính xác khi đặt dịch vụ: họ tên, số điện thoại, email. 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 không chịu trách nhiệm nếu thông tin sai gây lỗi trong quá trình đặt dịch vụ hoặc thanh toán.<br />
        Tuyệt đối không sử dụng công cụ hay hình thức phá hoại website. Mọi vi phạm sẽ bị xử lý theo pháp luật.
      </Typography>
    </Box>
  );
}