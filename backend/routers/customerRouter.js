const express = require("express");

const { register, login } = require("../controller/customerController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
