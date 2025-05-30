const express = require("express");
const router = express.Router();
const { getYachtImageById } = require("../controller/yachtImageController");

router.get("/yacht/:id", getYachtImageById);

module.exports = router;
