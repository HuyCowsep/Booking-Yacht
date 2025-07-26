const express = require("express");
const router = express.Router();
const {getLocations} = require("../controller/locationController");

router.get("/getAllLocation", getLocations);

module.exports = router;
