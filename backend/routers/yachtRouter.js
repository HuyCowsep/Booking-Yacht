const express = require("express");
const {createYacht, addServiceToYacht, addScheduleToYacht} = require('../controller/yachtController');
const router = express.Router();
const {upload} = require('../utils/configClound')
const {
  getAllYacht,
  getAllServices,
  searchYachts,
  getFeedbacksByYacht,
  getSchedulesByYacht,
  getYachtById,
  getServicesByYachtId,
  getYachtsByCompanyId,
  updateScheduleToYacht,
  updateYacht,
  softDeleteYacht
  // createYacht,
  // addServiceToYacht,
  // addScheduleToYacht,
} = require("../controller/yachtController");

router.get("/", getAllYacht);
router.get("/services", getAllServices);
router.get("/findboat", searchYachts);
router.get("/findboat/:id", getYachtById);
router.get("/:companyId", getYachtsByCompanyId);
router.get("/:id/feedbacks", getFeedbacksByYacht);
router.get("/:id/services", getServicesByYachtId);
router.get("/:id/schedules", getSchedulesByYacht);
// router.post('/create', upload.single('image'), createYacht);
// router.post('/add-service', addServiceToYacht);
// router.post('/add-schedule', addScheduleToYacht);
router.post('/insertYacht', upload.single('image'), createYacht);
router.post('/add-service', addServiceToYacht);
router.post('/add-schedule', addScheduleToYacht);

// API cập nhật lịch trình của du thuyền
router.put("/updateSchedule/:yachtId/:scheduleId", updateScheduleToYacht);
router.put('/updateYacht/:id', upload.single('image'), updateYacht);
router.put('/delete/:id', softDeleteYacht);

module.exports = router;
