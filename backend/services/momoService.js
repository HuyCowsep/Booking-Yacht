// services/momoService.js
const axios = require("axios");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid"); // Để tạo requestId

const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
const MOMO_API_ENDPOINT = process.env.MOMO_API_ENDPOINT;
const MOMO_QUERY_STATUS_API = process.env.MOMO_QUERY_STATUS_API;
const MOMO_REQUEST_TYPE = process.env.MOMO_REQUEST_TYPE || "captureWallet"; // payWithApp, captureWallet, ...

async function createPaymentRequest(
  transaction,
  booking,
  clientReturnUrl,
  serverIpnUrl
) {
  const requestId = uuidv4(); //  Mã yêu cầu duy nhất cho mỗi lần tạo
  const orderId = transaction.transaction_reference; // Mã đơn hàng của bạn
  const amount = transaction.amount.toString();
  const orderInfo = `Thanh toan don hang ${booking.bookingCode}`;
  const extraData = ""; // Base64 encoded JSON string, nếu cần (ví dụ: { "email": "abc@gmail.com"})

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${serverIpnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${clientReturnUrl}&requestId=${requestId}&requestType=${MOMO_REQUEST_TYPE}`;

  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY, // Một số API MoMo không cần accessKey trong body
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: clientReturnUrl,
    ipnUrl: serverIpnUrl,
    extraData: extraData,
    requestType: MOMO_REQUEST_TYPE,
    signature: signature,
    lang: "vi",
  };

  try {
    const response = await axios.post(MOMO_API_ENDPOINT, requestBody);
    const momoResponse = response.data;

    if (momoResponse.resultCode !== 0) {
      console.error("MoMo Create Payment Error:", momoResponse);
      throw new Error(
        `MoMo Error: ${momoResponse.message} (Code: ${momoResponse.resultCode})`
      );
    }

    return {
      payUrl: momoResponse.payUrl,
      qrCodeUrl: momoResponse.qrCodeUrl,
      deeplink: momoResponse.deeplink || momoResponse.deepLink, // Check tài liệu MoMo tên chính xác
      momoOrderId: orderId, // Là orderId của bạn
      momoRequestId: requestId,
      // Có thể trả về thêm transId nếu MoMo trả về ngay lúc tạo (thường là không)
    };
  } catch (error) {
    console.error(
      "Error calling MoMo Create Payment API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

function verifySignature(momoPayload, secretKey, isIpn = true) {
  const receivedSignature = momoPayload.signature;
  let dataToSign = "";

  // Các trường để tạo chữ ký cho IPN và Return URL có thể khác nhau.
  // CẦN KIỂM TRA KỸ TÀI LIỆU MOMO CHO Từng LOẠI CALLBACK.
  // Ví dụ dưới đây là cho IPN (thường đầy đủ hơn)
  const fieldsForSignature = [
    "partnerCode",
    "orderId",
    "requestId",
    "amount",
    "orderInfo",
    "orderType",
    "transId",
    "resultCode",
    "message",
    "payType",
    "responseTime",
    "extraData", //Thêm/bớt trường theo tài liệu MoMo cho loại chữ ký cụ thể
  ];

  // Sắp xếp theo alphabet nếu MoMo yêu cầu, nếu không thì theo thứ tự trong tài liệu
  // MoMo thường yêu cầu chính xác thứ tự như trong tài liệu.
  // Ví dụ (cần chính xác theo tài liệu MoMo cho IPN/Return):
  // rawSignature = "partnerCode=" + momoPayload.partnerCode +
  //             "&accessKey=" + momoPayload.accessKey + // MoMo Return có accessKey, IPN thì không
  //             "&requestId=" + momoPayload.requestId +
  //             "&amount=" + momoPayload.amount +
  //             "&orderId=" + momoPayload.orderId +
  //             "&orderInfo=" + momoPayload.orderInfo +
  //             "&orderType=" + momoPayload.orderType +
  //             "&transId=" + momoPayload.transId +
  //             "&message=" + momoPayload.message +
  //             "&localMessage=" + momoPayload.localMessage +
  //             "&responseTime=" + momoPayload.responseTime +
  //             "&errorCode=" + momoPayload.errorCode + // resultCode mới đúng
  //             "&payType=" + momoPayload.payType +
  //             "&extraData=" + momoPayload.extraData;

  // Dưới đây là cách tổng quát hơn bằng cách lặp qua các trường yêu cầu
  let sortedKeys = Object.keys(momoPayload).sort(); // MoMo không yêu cầu sort, mà là thứ tự cố định
  // --> Nên lấy danh sách các key cần ký theo thứ tự từ tài liệu MoMo.
  // Ví dụ:
  const signatureParams = {};
  for (const key of fieldsForSignature) {
    if (
      momoPayload.hasOwnProperty(key) &&
      momoPayload[key] !== undefined &&
      momoPayload[key] !== null &&
      momoPayload[key] !== ""
    ) {
      // Chỉ lấy các trường có giá trị và được yêu cầu ký
      signatureParams[key] = momoPayload[key];
    }
  }
  // Bây giờ tạo chuỗi dataToSign từ signatureParams theo đúng thứ tự MoMo yêu cầu
  // Ví dụ (phải đúng thứ tự):
  // dataToSign = `accessKey=${signatureParams.accessKey}&amount=${signatureParams.amount}&...`;
  // HOẶC là một chuỗi các giá trị nối lại, tùy theo tài liệu.

  // Ví dụ tạm: (CẦN THAY THẾ BẰNG LOGIC CHÍNH XÁC TỪ TÀI LIỆU MOMO)
  dataToSign = `partnerCode=${momoPayload.partnerCode}&accessKey=${momoPayload.accessKey}&requestId=${momoPayload.requestId}&amount=${momoPayload.amount}&orderId=${momoPayload.orderId}&orderInfo=${momoPayload.orderInfo}&orderType=${momoPayload.orderType}&transId=${momoPayload.transId}&resultCode=${momoPayload.resultCode}&message=${momoPayload.message}&payType=${momoPayload.payType}&responseTime=${momoPayload.responseTime}&extraData=${momoPayload.extraData}`;
  // Loại bỏ các trường không có giá trị hoặc undefined khỏi chuỗi dataToSign.

  const calculatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("hex");

  return receivedSignature === calculatedSignature;
}

async function queryTransactionStatus(orderId, requestId) {
  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&orderId=${orderId}&partnerCode=${MOMO_PARTNER_CODE}&requestId=${requestId}`;
  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    requestId: requestId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  };

  try {
    const response = await axios.post(MOMO_QUERY_STATUS_API, requestBody);
    return response.data;
  } catch (error) {
    console.error(
      "Error querying MoMo transaction:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = {
  createPaymentRequest,
  verifySignature,
  queryTransactionStatus,
};
