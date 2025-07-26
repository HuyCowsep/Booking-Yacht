const express = require("express");
const router = express.Router();
const {getYachtType} = require("../controller/yachtTypeController");

router.get("/getYachtType", getYachtType);

module.exports = router;
