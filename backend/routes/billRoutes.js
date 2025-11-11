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
const { protect, admin } = require('../middleware/auth');

// All routes are protected
router.route('/')
  .get(protect, getBills)
  .post(protect, createBill);

router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/stats/monthly', protect, getMonthlySummary);
router.get('/stats/monthly/pdf', protect, generateMonthlySummaryPDF);

router.route('/:id')
  .get(protect, getBillById)
  .delete(protect, admin, deleteBill);

router.get('/:id/pdf', protect, generateBillPDF);

module.exports = router;
