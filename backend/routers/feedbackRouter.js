const express = require("express");
const router = express.Router();
const {
  getFeedbackByYacht,
  submitFeedback,
} = require("../controller/feedbackController");

router.get("/", getFeedbackByYacht);
router.post("/", submitFeedback);

module.exports = router;
