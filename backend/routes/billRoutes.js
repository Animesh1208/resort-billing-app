const express = require('express');
const router = express.Router();
const {
  createBill,
  getBills,
  getBillById,
  deleteBill,
  generateBillPDF,
  getDashboardStats,
  getMonthlySummary,
  generateMonthlySummaryPDF,
} = require('../controllers/billController');

// Routes without authentication
router.route('/')
  .get(getBills)
  .post(createBill);

router.get('/stats/dashboard', getDashboardStats);
router.get('/stats/monthly', getMonthlySummary);
router.get('/stats/monthly/pdf', generateMonthlySummaryPDF);

router.route('/:id')
  .get(getBillById)
  .delete(deleteBill);

router.get('/:id/pdf', generateBillPDF);

module.exports = router;
