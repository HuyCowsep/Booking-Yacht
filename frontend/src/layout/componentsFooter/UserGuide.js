import React from "react";
import { Box, Typography } from "@mui/material";

export default function UserGuide() {
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
      <Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
        Hướng dẫn sử dụng
      </Typography>

      {/* 1. Khách hàng cá nhân */}
      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        1. Dành cho khách hàng cá nhân: đặt du thuyền, đặt vé máy bay
      </Typography>

      {/* 1.1 Du thuyền */}
      <Typography variant="subtitle1" gutterBottom sx={{ color: "text.primary" }}>
        1.1 Du thuyền Hạ Long:
      </Typography>
      <Typography component="ol" sx={{ color: "text.secondary", pl: 3 }}>
        <li>Tìm kiếm du thuyền phù hợp với yêu cầu của quý khách</li>
        <li>
          Nhập phòng và du thuyền cần đặt cùng với họ và tên, số điện thoại, địa chỉ email để nhân viên tư vấn
          của 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 liên hệ
        </li>
        <li>Chọn "Đặt ngay" để đặt dịch vụ</li>
        <li>Thông tin của khách hàng được gửi về trung tâm xử lý dữ liệu của website</li>
        <li>
          Nhân viên tư vấn sẽ kiểm tra tính có sẵn của dịch vụ và tính hợp lệ của đơn hàng sau đó gọi điện
          liên hệ với khách để yêu cầu chuyển tiền
        </li>
        <li>Sau khi khách hàng chuyển tiền, nhân viên tư vấn sẽ tiến hành đặt dịch vụ với các bên đối tác</li>
        <li>
          Nhân viên tư vấn sẽ gửi phiếu xác nhận dịch vụ bao gồm mã đơn hàng, thông tin khách hàng, thông tin
          dịch vụ và tổng giá trị dịch vụ
        </li>
      </Typography>

      {/* 1.2 Vé máy bay */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, color: "text.primary" }}>
        1.2 Vé máy bay:
      </Typography>
      <Typography component="ol" sx={{ color: "text.secondary", pl: 3 }}>
        <li>Tìm kiếm chuyến bay phù hợp với yêu cầu của quý khách</li>
        <li>
          Nhập thông tin khách gồm: họ và tên, số điện thoại, xác thực bằng địa chỉ email và ấn “Tiếp” đến
          bước thanh toán
        </li>
        <li>Thanh toán bằng mã QR cùng số tiền hiển thị trên màn hình</li>
        <li>
          Vé xuất sẽ được gửi về địa chỉ email của quý khách hàng và email huyndhe176876@fpt.edu.vn của website
        </li>
        <li>
          Nhân viên tư vấn sẽ kiểm tra lại vé đã được gửi đến quý khách hàng hay chưa để hỗ trợ kịp thời
        </li>
      </Typography>

      {/* 2. Quy trình huỷ đơn */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "text.primary" }}>
        2. Quy trình hủy đơn hàng
      </Typography>

      {/* 2.1 Du thuyền */}
      <Typography variant="subtitle1" gutterBottom sx={{ color: "text.primary" }}>
        2.1 Du thuyền Hạ Long:
      </Typography>
      <Typography component="ul" sx={{ color: "text.secondary", pl: 3 }}>
        <li>Gửi yêu cầu theo form “liên hệ” trên website</li>
        <li>Gửi thông tin tới địa chỉ email: huyndhe176876@fpt.edu.vn</li>
        <li>Gọi điện thoại tới số điện thoại:  0912 202 885</li>
        <li>Liên hệ với nhân viên phụ trách đơn hàng của quý khách</li>
      </Typography>

      {/* 2.2 Vé máy bay */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, color: "text.primary" }}>
        2.2 Vé máy bay:
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Vé máy bay sau khi xuất vé thành công sẽ không thể hủy trên website cũng như hệ thống vé máy bay của
        các hãng hàng không.
      </Typography>
      <Typography paragraph sx={{ color: "text.secondary" }}>
        Khách hàng liên hệ với nhân viên tư vấn để được hỗ trợ xử lý vé sau khi xuất vé thành công.
      </Typography>

      {/* 3. Giải quyết phát sinh */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "text.primary" }}>
        3. Giải quyết các phát sinh trong quá trình giao dịch
      </Typography>
      <Typography component="ul" sx={{ color: "text.secondary", pl: 3 }}>
        <li>
          𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 luôn có trách nhiệm tiếp nhận và xử lý khiếu nại của khách hàng liên quan đến giao dịch
          tại: 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com
        </li>
        <li>
          Khi có tranh chấp xảy ra, quý khách hàng liên hệ ngay với 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 theo số hotline: 0912 202 885
          hoặc gửi email: info@𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com. Chúng tôi sẽ liên hệ lại ngay để giải quyết
        </li>
        <li>
          Mọi tranh chấp giữa 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 và khách hàng sẽ được giải quyết trên cơ sở thương lượng. Nếu không đạt
          thỏa thuận, các bên có thể đưa vụ việc ra Tòa án kinh tế
        </li>
        <li>
          Nếu tranh chấp xảy ra giữa khách hàng và nhà cung cấp dịch vụ, ban quản lý website sẽ hỗ trợ khách
          hàng bảo vệ quyền lợi hợp pháp
        </li>
        <li>Khi thực hiện giao dịch trên website, các thành viên bắt buộc tuân theo đúng hướng dẫn</li>
      </Typography>
    </Box>
  );
}
