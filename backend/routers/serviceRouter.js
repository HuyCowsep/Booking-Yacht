const express = require("express");
const router = express.Router();
const {getServicesByYacht} = require("../controller/serviceController");

// Lấy dịch vụ theo yachtId
router.get("/yachts/:yachtId/services", getServicesByYacht);

module.exports = router;
