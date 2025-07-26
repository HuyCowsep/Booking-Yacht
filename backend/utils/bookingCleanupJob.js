const BookingOrder = require("../model/bookingOrder");
const cron = require("node-cron");

// Hàm cleanup booking
async function cleanupBookings() {
  const now = new Date();
  // 1. Xóa booking cancelled quá 24h
  const cutoffCancelled = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  await BookingOrder.deleteMany({
    status: "cancelled",
    cancelledAt: { $lte: cutoffCancelled },
  });

  // 2. Chuyển booking pending_payment/consultation_requested quá 1h sang cancelled
  const cutoffPending = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const bookingsToCancel = await BookingOrder.find({
    status: { $in: ["pending_payment", "consultation_requested"] },
    createdAt: { $lte: cutoffPending },
  });
  for (const booking of bookingsToCancel) {
    booking.status = "cancelled";
    booking.cancelledAt = now;
    await booking.save();
  }
}

// Chạy job mỗi phút thay vì mỗi giờ
cron.schedule("* * * * *", cleanupBookings);

module.exports = cleanupBookings;
