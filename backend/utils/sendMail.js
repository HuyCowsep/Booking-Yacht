const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm gửi email xác nhận đặt phòng (Đặt lịch)
async function sendBookingConfirmationEmail(
  to,
  fullName,
  bookingCode,
  checkInDate,
  guestCount,
  totalPrice,
  options = {}
) {
  if (!to || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(to)) {
    throw new Error("Email không hợp lệ hoặc không tìm thấy email.");
  }
  const subject = "Xác nhận đặt phòng du thuyền";
  const text = `Cảm ơn ${fullName} đã đặt phòng. Mã booking của bạn là: ${bookingCode}`;
  const yachtName = options.yachtName || "";
  const roomListHtml = options.roomListHtml || "";
  const requirements = options.requirements || "";
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8" /><title>Xác nhận đặt phòng du thuyền</title></head>
      <body style="font-family: Arial, sans-serif; background: #f6f8fa; margin:0; padding:0;">
        <table width="100%" bgcolor="#f6f8fa" cellpadding="0" cellspacing="0"><tr><td>
          <table align="center" width="600" style="background: #fff; border-radius: 10px; margin: 40px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <tr><td style="background: #14b8a6; color: #fff; padding: 24px 32px; border-radius: 10px 10px 0 0; text-align: center;"><h2 style="margin: 0;">XÁC NHẬN ĐẶT PHÒNG DU THUYỀN</h2></td></tr>
            <tr><td style="padding: 32px;">
              <p>Xin chào <b>${fullName}</b>,</p>
              <p>Cảm ơn bạn đã <b>đặt phòng du thuyền</b> tại <b>WDP Yacht</b>!</p>
              <table style="width:100%; margin: 24px 0; background: #f0fdfa; border-radius: 8px;"><tr><td style="padding: 12px 16px;">
                <b>Mã booking:</b> <span style="color:#14b8a6;">${bookingCode}</span><br/>
                <b>Tên du thuyền:</b> ${yachtName}<br/>
                <b>Ngày nhận phòng:</b> ${checkInDate}<br/>
                <b>Số khách:</b> ${guestCount}<br/>
                <b>Tổng tiền:</b> ${totalPrice} VNĐ<br/>
                <b>Phòng đã đặt:</b> ${roomListHtml}
                <b>Yêu cầu đặc biệt:</b> ${requirements}
              </td></tr></table>
              <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này hoặc số hotline <b>0123 456 789</b>.</p>
              <p style="margin-top: 32px;">Trân trọng,<br/>Đội ngũ WDP Yacht</p>
            </td></tr>
            <tr><td style="background: #f0fdfa; color: #888; padding: 16px 32px; border-radius: 0 0 10px 10px; text-align: center; font-size: 13px;">© 2024 WDP Yacht. All rights reserved.</td></tr>
          </table>
        </td></tr></table>
      </body>
    </html>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

// Hàm gửi email xác nhận đăng ký tư vấn
async function sendConsultationEmail(
  to,
  fullName,
  bookingCode,
  checkInDate,
  guestCount,
  requirements
) {
  if (!to || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(to)) {
    throw new Error("Email không hợp lệ hoặc không tìm thấy email.");
  }
  const subject = "Xác nhận đăng ký tư vấn du thuyền";
  const text = `Cảm ơn ${fullName} đã đăng ký tư vấn. Mã yêu cầu của bạn là: ${bookingCode}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8" /><title>Xác nhận đăng ký tư vấn du thuyền</title></head>
      <body style="font-family: Arial, sans-serif; background: #f6f8fa; margin:0; padding:0;">
        <table width="100%" bgcolor="#f6f8fa" cellpadding="0" cellspacing="0"><tr><td>
          <table align="center" width="600" style="background: #fff; border-radius: 10px; margin: 40px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <tr><td style="background: #f59e42; color: #fff; padding: 24px 32px; border-radius: 10px 10px 0 0; text-align: center;"><h2 style="margin: 0;">XÁC NHẬN ĐĂNG KÝ TƯ VẤN DU THUYỀN</h2></td></tr>
            <tr><td style="padding: 32px;">
              <p>Xin chào <b>${fullName}</b>,</p>
              <p>Bạn đã <b>đăng ký tư vấn du thuyền</b> thành công tại <b>WDP Yacht</b>!</p>
              <table style="width:100%; margin: 24px 0; background: #fff7ed; border-radius: 8px;"><tr><td style="padding: 12px 16px;">
                <b>Mã yêu cầu:</b> <span style="color:#f59e42;">${bookingCode}</span><br/>
                <b>Ngày mong muốn nhận phòng:</b> ${checkInDate}<br/>
                <b>Số khách dự kiến:</b> ${guestCount}<br/>
                <b>Yêu cầu đặc biệt:</b> ${requirements || "Không có"}<br/>
              </td></tr></table>
              <p>Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất để tư vấn chi tiết.</p>
              <p style="margin-top: 32px;">Trân trọng,<br/>Đội ngũ WDP Yacht</p>
            </td></tr>
            <tr><td style="background: #fff7ed; color: #888; padding: 16px 32px; border-radius: 0 0 10px 10px; text-align: center; font-size: 13px;">© 2024 WDP Yacht. All rights reserved.</td></tr>
          </table>
        </td></tr></table>
      </body>
    </html>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

// Hàm test gửi email đơn giản
async function testSendMail(to) {
  if (!to || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(to)) {
    throw new Error("Email không hợp lệ hoặc không tìm thấy email.");
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Test Nodemailer",
    text: "Đây là email test gửi từ hệ thống Nodemailer!",
    html: "<b>Đây là email test gửi từ hệ thống Nodemailer!</b>",
  };
  return transporter.sendMail(mailOptions);
}

// Hàm gửi OTP để đặt lại mật khẩu
async function sendOTP(to, otp) {
  if (!to || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(to)) {
    throw new Error("Email không hợp lệ hoặc không tìm thấy email.");
  }
  const subject = "Mã OTP để đặt lại mật khẩu";
  const text = `Mã OTP của bạn là: ${otp}. Vui lòng không chia sẻ mã này với bất kỳ ai. Mã sẽ tồn tại trong email này cho đến khi bạn xóa nó khỏi thùng rác.`;
  const html = `
    <!DOCTYPE html>
    <!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mã OTP đặt lại mật khẩu</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: #f6f8fa;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <table width="100%" bgcolor="#f6f8fa" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table align="center" width="600" style="background: #fff; border-radius: 12px; margin: 40px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: #dc2626; color: #fff; padding: 24px 32px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">🔐 MÃ OTP ĐẶT LẠI MẬT KHẨU</h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px;">Xin chào,</p>
              <p style="font-size: 16px;">Bạn hoặc ai đó vừa yêu cầu đặt lại mật khẩu cho tài khoản tại <strong>𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮</strong>.</p>

              <!-- OTP Block -->
              <div style="margin: 24px 0; text-align: center;">
                <p style="font-size: 18px; margin-bottom: 8px;">Mã OTP của bạn là:</p>
                <div style="display: inline-block; padding: 12px 24px; background: #fee2e2; border-radius: 8px; font-size: 28px; letter-spacing: 4px; color: #dc2626; font-weight: bold;">
                  ${otp}
                </div>
              </div>

              <p style="font-size: 15px;"><strong>Quan trọng:</strong> Không chia sẻ mã này với bất kỳ ai. Ngay cả nhân viên của 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 cũng không được phép hỏi mã này.</p>
              <p style="font-size: 15px;">Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này và kiểm tra lại bảo mật tài khoản.</p>

              <p style="margin-top: 40px; font-size: 15px;">Trân trọng,<br/>Đội ngũ <strong>𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮</strong></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #fef2f2; color: #6b7280; text-align: center; font-size: 13px; padding: 20px;">
              © 2025 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮. Mọi quyền được bảo lưu.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

// Hàm gửi email đăng ký tài khoản công ty
async function sendCompanyRegisterEmail(to, companyName, username, password) {
  if (!to || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(to)) {
    throw new Error("Email không hợp lệ hoặc không tìm thấy email.");
  }
  const subject = "Thông tin đăng ký tài khoản công ty";
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8" /><title>Đăng ký tài khoản công ty</title></head>
      <body style="font-family: Arial, sans-serif; background: #f6f8fa; margin:0; padding:0;">
        <table width="100%" bgcolor="#f6f8fa" cellpadding="0" cellspacing="0"><tr><td>
          <table align="center" width="600" style="background: #fff; border-radius: 10px; margin: 40px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <tr><td style="background: #1976d2; color: #fff; padding: 24px 32px; border-radius: 10px 10px 0 0; text-align: center;"><h2 style="margin: 0;">ĐĂNG KÝ TÀI KHOẢN CÔNG TY THÀNH CÔNG</h2></td></tr>
            <tr><td style="padding: 32px;">
              <p>Xin chào <b>${companyName}</b>,</p>
              <p>Tài khoản công ty của bạn đã được tạo thành công trên hệ thống.</p>
              <table style="width:100%; margin: 24px 0; background: #e3f2fd; border-radius: 8px;"><tr><td style="padding: 12px 16px;">
                <b>Tên đăng nhập:</b> <span style="color:#1976d2;">${username}</span><br/>
                <b>Mật khẩu:</b> <span style="color:#1976d2;">${password}</span>
              </td></tr></table>
              <p>Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.</p>
              <p style="margin-top: 32px;">Trân trọng,<br/>Đội ngũ WDP Yacht</p>
            </td></tr>
            <tr><td style="background: #e3f2fd; color: #888; padding: 16px 32px; border-radius: 0 0 10px 10px; text-align: center; font-size: 13px;">© 2024 WDP Yacht. All rights reserved.</td></tr>
          </table>
        </td></tr></table>
      </body>
    </html>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}

// Hàm gửi email thông báo hủy booking
async function sendCancelBookingEmail(
  to,
  fullName,
  bookingCode,
  yachtName,
  checkInDate,
  totalPrice,
  depositAmount // Thêm tham số mới
) {
  if (!to || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(to)) {
    throw new Error("Email không hợp lệ hoặc không tìm thấy email.");
  }
  const subject = "Thông báo hủy booking du thuyền";
  const text = `Kính gửi ${fullName},\n\nBooking của bạn (mã: ${bookingCode}) đã được hủy theo yêu cầu.\nTên du thuyền: ${yachtName}\nNgày nhận phòng: ${checkInDate}\nTổng tiền: ${totalPrice} VNĐ${
    depositAmount ? `\nSố tiền đã thanh toán trước: ${depositAmount} VNĐ` : ""
  }\n\nNếu có thắc mắc, vui lòng liên hệ với chúng tôi.`;
  const depositHtml = depositAmount
    ? `<b>Số tiền đã thanh toán trước:</b> ${depositAmount} VNĐ<br/>`
    : "";
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset=\"UTF-8\" /><title>Thông báo hủy booking du thuyền</title></head>
      <body style=\"font-family: Arial, sans-serif; background: #f6f8fa; margin:0; padding:0;\">
        <table width=\"100%\" bgcolor=\"#f6f8fa\" cellpadding=\"0\" cellspacing=\"0\"><tr><td>
          <table align=\"center\" width=\"600\" style=\"background: #fff; border-radius: 10px; margin: 40px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);\">
            <tr><td style=\"background: #d32f2f; color: #fff; padding: 24px 32px; border-radius: 10px 10px 0 0; text-align: center;\"><h2 style=\"margin: 0;\">THÔNG BÁO HỦY BOOKING DU THUYỀN</h2></td></tr>
            <tr><td style=\"padding: 32px;\">
              <p>Xin chào <b>${fullName}</b>,</p>
              <p>Booking của bạn đã được <b>hủy thành công</b> theo yêu cầu.</p>
              <table style=\"width:100%; margin: 24px 0; background: #ffebee; border-radius: 8px;\"><tr><td style=\"padding: 12px 16px;\">
                <b>Mã booking:</b> <span style=\"color:#d32f2f;\">${bookingCode}</span><br/>
                <b>Tên du thuyền:</b> ${yachtName}<br/>
                <b>Ngày nhận phòng:</b> ${checkInDate}<br/>
                <b>Tổng tiền:</b> ${totalPrice} VNĐ<br/>
                ${depositHtml}
              </td></tr></table>
              <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này hoặc số hotline <b>0123 456 789</b>.</p>
              <p style=\"margin-top: 32px;\">Trân trọng,<br/>Đội ngũ WDP Yacht</p>
            </td></tr>
            <tr><td style=\"background: #ffebee; color: #888; padding: 16px 32px; border-radius: 0 0 10px 10px; text-align: center; font-size: 13px;\">© 2024 WDP Yacht. All rights reserved.</td></tr>
          </table>
        </td></tr></table>
      </body>
    </html>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendBookingConfirmationEmail,
  sendConsultationEmail,
  testSendMail,
  sendOTP,
  sendCompanyRegisterEmail,
  sendCancelBookingEmail, // Thêm export hàm mới
};
