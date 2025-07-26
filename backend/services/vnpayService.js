// services/vnpayService.js
const axios = require("axios");
const crypto = require("crypto");
const querystring = require("qs"); // Để sắp xếp và stringify query params cho VNPay
const moment = require("moment"); // Để format ngày giờ theo yêu cầu VNPay

const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE;
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET;
const VNPAY_URL = process.env.VNPAY_URL;
const VNPAY_API_URL = process.env.VNPAY_API_URL; // QueryDR URL (dùng cho querydr)
const VNPAY_RETURN_URL = process.env.VNPAY_RETURN_URL;
const VNPAY_IPN_URL = process.env.VNPAY_IPN_URL; // Dùng cho IPN callback nếu có

async function createPaymentUrl(
  transaction,
  booking,
  clientReturnUrl,
  serverIpnUrl
) {
  const createDate = moment(transaction.createdAt).format("YYYYMMDDHHmmss");
  const expireDate = moment(transaction.expiredAt).format("YYYYMMDDHHmmss");
  const orderId = transaction.transaction_reference; // Mã giao dịch của bạn
  const amount = transaction.amount * 100; // VNPay yêu cầu amount * 100
  const orderInfo = `Thanh toan don hang ${booking.bookingCode} - ${transaction.transaction_reference}`;
  const ipAddr = "127.0.0.1"; // Lấy IP thực của khách hàng nếu có thể (req.ip)

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNPAY_TMN_CODE,
    vnp_Amount: amount,
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: ipAddr,
    vnp_Locale: "vn",
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other", // Hoặc loại phù hợp
    vnp_ReturnUrl: clientReturnUrl,
    vnp_TxnRef: orderId, // Mã tham chiếu của bạn
    vnp_ExpireDate: expireDate,
    // vnp_Bill_Mobile: booking.customerInfo.phoneNumber,
    // vnp_Bill_Email: booking.customerInfo.email,
    // vnp_Bill_FirstName: booking.customerInfo.fullName.split(' ').slice(-1).join(' '),
    // vnp_Bill_LastName: booking.customerInfo.fullName.split(' ').slice(0, -1).join(' '),
    // vnp_Bill_Address: booking.customerInfo.address,
    // vnp_Inv_Customer: booking.customerInfo.fullName,
  };
  if (serverIpnUrl) {
    // IPN URL là tùy chọn với VNPay cổng thanh toán, nhưng bắt buộc với QR Code
    // vnp_Params['vnp_IpnUrl'] = serverIpnUrl; // Cần kiểm tra lại tài liệu VNPay về IPN URL khi tạo payment
  }

  vnp_Params = sortObject(vnp_Params); // Sắp xếp params theo alphabet
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const paymentUrl =
    VNPAY_URL + "?" + querystring.stringify(vnp_Params, { encode: false });

  return { paymentUrl, vnp_TxnRef_Gateway: orderId }; // vnp_TxnRef_Gateway là mã của bạn
}

function verifySignature(vnp_Params, secureHashSecret) {
  const secureHash = vnp_Params["vnp_SecureHash"];
  let paramsToSign = { ...vnp_Params };
  delete paramsToSign["vnp_SecureHash"]; // Xóa hash cũ
  delete paramsToSign["vnp_SecureHashType"]; // Xóa type nếu có

  paramsToSign = sortObject(paramsToSign);
  const signData = querystring.stringify(paramsToSign, { encode: false });
  const hmac = crypto.createHmac("sha512", secureHashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
}

async function queryTransactionStatus(
  orderId,
  transactionDate,
  ipAddr = "127.0.0.1"
) {
  const requestId =
    moment().format("YYYYMMDDHHmmss") + Math.random().toString(36).substr(2, 6); // Tạo request ID duy nhất

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "querydr",
    vnp_TmnCode: VNPAY_TMN_CODE,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Query transaction ${orderId}`,
    vnp_TransDate: transactionDate, // Ngày tạo giao dịch (vnp_CreateDate)
    vnp_CreateDate: moment().format("YYYYMMDDHHmmss"), // Ngày tạo yêu cầu query
    vnp_IpAddr: ipAddr,
    vnp_RequestId: requestId, // Cần thiết cho QueryDR một số phiên bản
  };

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  try {
    const response = await axios.post(
      VNPAY_API_URL, // Sử dụng API URL cho querydr
      querystring.stringify(vnp_Params, { encode: false }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    // Parse response từ string key=value&key2=value2 sang object
    const responseData = querystring.parse(response.data);
    // Xác thực chữ ký response từ QueryDR nếu VNPay có trả về vnp_SecureHash
    // if (responseData.vnp_SecureHash && !verifySignature(responseData, VNPAY_HASH_SECRET)) {
    //   throw new Error('Invalid signature in QueryDR response');
    // }
    return responseData;
  } catch (error) {
    console.error(
      "Error querying VNPay transaction:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Helper function to sort object properties alphabetically
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  createPaymentUrl,
  verifySignature,
  queryTransactionStatus,
};
