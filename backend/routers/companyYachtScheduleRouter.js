const express = require('express');
const router = express.Router();
const companyYachtScheduleController = require('../controller/companyYachtScheduleController');
const { authenticate, isCompany } = require('../middleware/authMiddleware');

// Middleware xác thực và phân quyền company
router.use(authenticate, isCompany);

router.get('/', companyYachtScheduleController.getAll);
router.post('/', companyYachtScheduleController.create);
router.put('/:id', companyYachtScheduleController.update);
router.delete('/:id', companyYachtScheduleController.remove);

module.exports = router;