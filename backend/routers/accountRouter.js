const express = require("express");
const { getAllAccounts, login } = require("../controller/accountController");

const router = express.Router();

router.get("/", getAllAccounts);
router.post("/login", login);

module.exports = router;
