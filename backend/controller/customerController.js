//lưu mật khẩu thường không hashpassword thì dùng code dưới này

// const { Customer, Account } = require("../model");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const register = async (req, res) => {
//   try {
//     const { username, email, fullName, phoneNumber, address, password } = req.body;
//     if (!username || !email || !fullName || !phoneNumber || !address || !password) {
//       return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
//     }

//     const existing = await Account.findOne({ username });
//     if (existing) {
//       return res.status(400).json({ message: "Tên đăng nhập đã tồn tại, vui lòng dùng tên đăng nhập khác!" });
//     }
//     // Tạo tài khoản Account
//     const account = await Account.create({
//       username,
//       password,
//       roles: "CUSTOMER",
//       status: 1,
//     });
//     // Tạo hồ sơ Customer
//     const customer = await Customer.create({
//       fullName,
//       email,
//       phoneNumber,
//       address,
//       accountId: account._id,
//     });

//     res.status(201).json({
//       message: "Tạo tài khoản thành công",
//       customer: {
//         fullName: customer.fullName,
//         email: customer.email,
//         phoneNumber: customer.phoneNumber,
//         address: customer.address,
//         username: account.username,
//       },
//     });
//   } catch (error) {
//     console.error("Đăng ký bị lỗi:", error);
//     res.status(500).json({ message: "Lỗi server khi đăng ký, thử lại sau" });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: "Hãy điền tên đăng nhập và mật khẩu" });
//     }

//     const account = await Account.findOne({ username });
//     if (!account) {
//       return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
//     }

//     if (account.password !== password) {
//       return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
//     }

//     const customer = await Customer.findOne({ accountId: account._id });

//     const token = jwt.sign({ _id: account._id, role: account.roles }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({
//       message: "Đăng nhập thành công",
//       token,
//       customer: {
//         fullName: customer?.fullName,
//         email: customer?.email,
//         phoneNumber: customer?.phoneNumber,
//         address: customer?.address,
//         username: account?.username,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Lỗi server khi đăng nhập" });
//   }
// };

// module.exports = { register, login };


// nếu mà muốn lưu mật khẩu dạng hash thì dùng code dưới này


const { Customer, Account } = require("../model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../utils/mailer");
const redisClient = require("../utils/redis");

const register = async (req, res) => {
  try {
    const { username, email, fullName, phoneNumber, address, password } = req.body;
    if (!username || !email || !fullName || !phoneNumber || !address || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const existing = await Account.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại, vui lòng dùng tên đăng nhập khác!" });
    }

    // Hash mật khẩu
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Tạo tài khoản Account
    const account = await Account.create({
      username,
      password: hashedPassword,
      roles: "CUSTOMER",
      status: 1,
    });

    // Tạo hồ sơ Customer
    const customer = await Customer.create({
      fullName,
      email,
      phoneNumber,
      address,
      accountId: account._id,
    });

    res.status(201).json({
      message: "Tạo tài khoản thành công",
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        username: account.username,
      },
    });
  } catch (error) {
    console.error("Đăng ký bị lỗi:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký, thử lại sau" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Hãy điền tên đăng nhập và mật khẩu" });
    }

    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    // So sánh mật khẩu
    const isMatch = await bcryptjs.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    const customer = await Customer.findOne({ accountId: account._id });

    const token = jwt.sign({ _id: account._id, role: account.roles }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      customer: {
        fullName: customer?.fullName,
        email: customer?.email,
        phoneNumber: customer?.phoneNumber,
        address: customer?.address,
        username: account?.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

const forgotPassword = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Vui lòng nhập username" });
  }

  try {
    const account = await Account.findOne({ username, roles: "CUSTOMER" });
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại hoặc không phải khách hàng" });
    }

    const customer = await Customer.findOne({ accountId: account._id });
    if (!customer || !customer.email) {
      return res.status(404).json({ message: "Không tìm thấy email của khách hàng" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setEx(`otp:${username}`, 10 * 60, otp);

    const sent = await sendOTP(customer.email, otp);
    if (!sent) {
      return res.status(500).json({ message: "Lỗi gửi email OTP" });
    }

    res.status(200).json({ message: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const verifyOtp = async (req, res) => {
  const { username, otp } = req.body;
  if (!username || !otp) {
    return res.status(400).json({ message: "Vui lòng nhập username và OTP" });
  }

  try {
    const storedOtp = await redisClient.get(`otp:${username}`);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    await redisClient.del(`otp:${username}`);
    res.status(200).json({ message: "Xác thực OTP thành công" });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập username và mật khẩu mới" });
  }

  try {
    const account = await Account.findOne({ username, roles: "CUSTOMER" });
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại hoặc không phải khách hàng" });
    }

    account.password = newPassword; // bcryptjs sẽ hash trong pre-save
    await account.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { register, login, forgotPassword, verifyOtp, resetPassword };