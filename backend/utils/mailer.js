const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // MailHog SMTP port
  secure: false, // Không dùng SSL cho MailHog
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: 'no-reply@yourapp.com',
    to: email,
    subject: 'Mã OTP Đặt Lại Mật Khẩu',
    text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
    html: `
      <h2>Đặt Lại Mật Khẩu</h2>
      <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
      <p>Mã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendOTP };