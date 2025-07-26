const express = require("express");
const router = express.Router();
const accountCompanyController = require("../controller/accountCompanyController");

// Tạo mới tài khoản công ty
router.post("/", accountCompanyController.createCompany);

// Lấy danh sách tài khoản công ty
router.get("/", accountCompanyController.getAllCompanies);

router.get("/count", accountCompanyController.countCompanies);
router.delete("/:id", accountCompanyController.deleteCompany);
router.put("/:id", accountCompanyController.updateCompany);
router.get("/revenue/monthly", accountCompanyController.getMonthlyRevenue);
module.exports = router;
