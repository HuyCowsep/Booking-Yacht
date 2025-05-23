const express = require("express");
const router = express.Router();

const { getAllCompany } = require("../controller/companyController");

router.get("/", getAllCompany); //get all company

module.exports = router;
