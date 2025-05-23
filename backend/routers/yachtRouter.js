const express = require("express");
const router = express.Router();
const { getAllYacht, getAllServices, searchYachts, getFeedbacksByYacht, getSchedulesByYacht } = require("../controller/yachtController");

router.get("/", getAllYacht);
router.get("/services", getAllServices);
router.get('/findboat', searchYachts);
router.get('/:id/feedbacks', getFeedbacksByYacht);
router.get('/:id/schedules', getSchedulesByYacht);

module.exports = router;
