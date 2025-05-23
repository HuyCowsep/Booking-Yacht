const express = require("express");
const { getAllAccounts } = require("../controller/accountController");

const router = express.Router();

router.get("/", getAllAccounts);

module.exports = router;
