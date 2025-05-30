const express = require("express");
const router = express.Router();
const { getRoomsWithTypes } = require("../controller/roomController");

router.get("/", getRoomsWithTypes);

module.exports = router;
