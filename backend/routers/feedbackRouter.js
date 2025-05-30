const express = require("express");
const router = express.Router();
const { getAllFeedback, getFeedbackByYacht, submitFeedback } = require("../controller/feedbackController");

router.get("/all", getAllFeedback);
// Lấy feedback theo yachtId (có phân trang, tìm kiếm)
router.get("/", getFeedbackByYacht);
// Gửi feedback mới
router.post("/", submitFeedback);

module.exports = router;
