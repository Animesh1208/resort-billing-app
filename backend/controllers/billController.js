const Bill = require('../models/Bill');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private
const createBill = async (req, res) => {
  try {
    const {
      customerName,
      roomNumber,
      checkIn,
      checkOut,
      roomCharges,
      foodCharges,
      otherCharges,
      taxPercentage,
      paymentMethod,
      notes,
    } = req.body;

    // Calculate number of days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (numberOfDays <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Calculate totals
    const subtotal = (roomCharges || 0) + (foodCharges || 0) + (otherCharges || 0);
    const tax = (subtotal * (taxPercentage || 5)) / 100;
    const totalAmount = subtotal + tax;

    const bill = await Bill.create({
      customerName,
      roomNumber,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfDays,
      roomCharges: roomCharges || 0,
      foodCharges: foodCharges || 0,
      otherCharges: otherCharges || 0,
      subtotal,
      tax,
      taxPercentage: taxPercentage || 18,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bills with filters
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res) => {
  try {
    const { search, startDate, endDate, status, roomNumber } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Search by customer name or invoice number
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by room number
    if (roomNumber) {
      query.roomNumber = roomNumber;
    }

    const total = await Bill.countDocuments(query);
    const bills = await Bill.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      bills,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete bill (admin only)
// @route   DELETE /api/bills/:id
// @access  Private/Admin
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (bill) {
      await bill.deleteOne();
      res.json({ message: 'Bill removed' });
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate PDF for bill
// @route   GET /api/bills/:id/pdf
// @access  Private
const generateBillPDF = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${bill.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('GULMOHAR RESORT', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Harindungri Jail Road, Ghatsila', { align: 'center' });
    doc.text('Phone: +91 9234549012 | Email: info@gulmoharresort.com', { align: 'center' });
    doc.text('GSTIN: 20hxapp9825X1ZX', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Invoice details
    doc.fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', { align: 'center' });
    doc.moveDown();

    // Two columns
    const leftColumn = 50;
    const rightColumn = 300;
    let currentY = doc.y;

    doc.fontSize(10).font('Helvetica-Bold').text('Invoice Number:', leftColumn, currentY);
    doc.font('Helvetica').text(bill.invoiceNumber, leftColumn + 100, currentY);

    doc.font('Helvetica-Bold').text('Date:', rightColumn, currentY);
    doc.font('Helvetica').text(new Date(bill.createdAt).toLocaleDateString(), rightColumn + 100, currentY);

    currentY += 20;
    doc.font('Helvetica-Bold').text('Customer Name:', leftColumn, currentY);
    doc.font('Helvetica').text(bill.customerName, leftColumn + 100, currentY);

    doc.font('Helvetica-Bold').text('Room Number:', rightColumn, currentY);
    doc.font('Helvetica').text(bill.roomNumber, rightColumn + 100, currentY);

    currentY += 20;
    doc.font('Helvetica-Bold').text('Check-In:', leftColumn, currentY);
    doc.font('Helvetica').text(new Date(bill.checkIn).toLocaleDateString(), leftColumn + 100, currentY);

    doc.font('Helvetica-Bold').text('Check-Out:', rightColumn, currentY);
    doc.font('Helvetica').text(new Date(bill.checkOut).toLocaleDateString(), rightColumn + 100, currentY);

    currentY += 20;
    doc.font('Helvetica-Bold').text('Duration:', leftColumn, currentY);
    doc.font('Helvetica').text(`${bill.numberOfDays} ${bill.numberOfDays > 1 ? 'Days' : 'Day'}`, leftColumn + 100, currentY);

    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Charges table
    const tableTop = doc.y;
    const descriptionX = 50;
    const amountX = 450;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Description', descriptionX, tableTop);
    doc.text('Amount (₹)', amountX, tableTop);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica');
    let itemY = doc.y;

    if (bill.roomCharges > 0) {
      doc.text(`Room Charges (${bill.numberOfDays} ${bill.numberOfDays > 1 ? 'days' : 'day'})`, descriptionX, itemY);
      doc.text('₹ ' + bill.roomCharges.toFixed(2), amountX, itemY);
      itemY = doc.y + 5;
    }

    if (bill.foodCharges > 0) {
      doc.text('Food & Beverages', descriptionX, itemY);
      doc.text('₹ ' + bill.foodCharges.toFixed(2), amountX, itemY);
      itemY = doc.y + 5;
    }

    if (bill.otherCharges > 0) {
      doc.text('Other Charges', descriptionX, itemY);
      doc.text('₹ ' + bill.otherCharges.toFixed(2), amountX, itemY);
      itemY = doc.y + 5;
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    // Subtotal
    doc.font('Helvetica-Bold').text('Subtotal:', descriptionX, doc.y);
    doc.text('₹ ' + bill.subtotal.toFixed(2), amountX, doc.y);
    doc.moveDown(0.5);

    // GST
    doc.text(`GST (${bill.taxPercentage}%):`, descriptionX, doc.y);
    doc.text('₹ ' + bill.tax.toFixed(2), amountX, doc.y);
    doc.moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    // Total
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('TOTAL AMOUNT:', descriptionX, doc.y);
    doc.text(`₹ ${bill.totalAmount.toFixed(2)}`, amountX, doc.y);

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Payment method
    doc.fontSize(10).font('Helvetica');
    doc.text(`Payment Method: ${bill.paymentMethod.toUpperCase()}`, descriptionX);

    if (bill.notes) {
      doc.moveDown();
      doc.text(`Notes: ${bill.notes}`, descriptionX);
    }

    // Footer
    doc.moveDown(3);
    doc.fontSize(8).text('Thank you for staying with us!', { align: 'center' });
    doc.text('We hope to see you again soon.', { align: 'center' });
    doc.moveDown();
    doc.text('Generated by: Resort Staff', { align: 'center' });
    doc.text('This is a computer-generated invoice.', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/bills/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Today's revenue
    const todayRevenue = await Bill.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // This month's revenue
    const monthRevenue = await Bill.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Last month's revenue
    const lastMonthRevenue = await Bill.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth }, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Total bills count
    const totalBills = await Bill.countDocuments();
    const todayBills = await Bill.countDocuments({ createdAt: { $gte: today } });

    res.json({
      todayRevenue: todayRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
      totalBills,
      todayBills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get monthly summary
const getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bills = await Bill.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: -1 });

    // Calculate summary stats
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalRoomCharges = bills.reduce((sum, bill) => sum + bill.roomCharges, 0);
    const totalFoodCharges = bills.reduce((sum, bill) => sum + bill.foodCharges, 0);
    const totalOtherCharges = bills.reduce((sum, bill) => sum + bill.otherCharges, 0);
    const totalTax = bills.reduce((sum, bill) => sum + bill.tax, 0);

    const paidBills = bills.filter((b) => b.status === 'paid');
    const pendingBills = bills.filter((b) => b.status === 'pending');

    res.json({
      month,
      year,
      totalBills: bills.length,
      totalRevenue,
      totalRoomCharges,
      totalFoodCharges,
      totalOtherCharges,
      totalTax,
      paidCount: paidBills.length,
      pendingCount: pendingBills.length,
      bills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate monthly summary PDF
const generateMonthlySummaryPDF = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bills = await Bill.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: 1 });

    // Calculate summary
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalRoomCharges = bills.reduce((sum, bill) => sum + bill.roomCharges, 0);
    const totalFoodCharges = bills.reduce((sum, bill) => sum + bill.foodCharges, 0);
    const totalOtherCharges = bills.reduce((sum, bill) => sum + bill.otherCharges, 0);
    const totalTax = bills.reduce((sum, bill) => sum + bill.tax, 0);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=monthly-summary-${year}-${month}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('GULMOHAR RESORT', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Harindungri Jail Road, Ghatsila', { align: 'center' });
    doc.text('Phone: +91 9234549012 | Email: info@gulmoharresort.com', { align: 'center' });
    doc.text('GSTIN: 20hxapp9825X1ZX', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Title
    doc.fontSize(18).font('Helvetica-Bold').text('MONTHLY SUMMARY REPORT', { align: 'center' });
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    doc.fontSize(14).font('Helvetica').text(`${monthNames[month - 1]} ${year}`, { align: 'center' });
    doc.moveDown(2);

    // Summary Statistics
    doc.fontSize(12).font('Helvetica-Bold').text('Summary Statistics', 50);
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');

    const leftCol = 50;
    const rightCol = 320;
    let currentY = doc.y;

    doc.text(`Total Bills: ${bills.length}`, leftCol, currentY);
    doc.text(`Total Revenue: ₹ ${totalRevenue.toFixed(2)}`, rightCol, currentY);

    currentY += 20;
    doc.text(`Room Charges: ₹ ${totalRoomCharges.toFixed(2)}`, leftCol, currentY);
    doc.text(`Food Charges: ₹ ${totalFoodCharges.toFixed(2)}`, rightCol, currentY);

    currentY += 20;
    doc.text(`Other Charges: ₹ ${totalOtherCharges.toFixed(2)}`, leftCol, currentY);
    doc.text(`Total GST: ₹ ${totalTax.toFixed(2)}`, rightCol, currentY);

    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Bills Table
    doc.fontSize(12).font('Helvetica-Bold').text('Detailed Bills', 50);
    doc.moveDown(0.5);

    const tableTop = doc.y;
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Date', 50, tableTop);
    doc.text('Invoice', 110, tableTop);
    doc.text('Customer', 180, tableTop);
    doc.text('Room', 280, tableTop);
    doc.text('Amount', 330, tableTop);
    doc.text('Status', 400, tableTop);

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.3);

    doc.font('Helvetica').fontSize(8);
    let itemY = doc.y;

    bills.forEach((bill) => {
      if (itemY > 700) {
        doc.addPage();
        itemY = 50;
      }

      const date = new Date(bill.createdAt).toLocaleDateString();
      doc.text(date, 50, itemY);
      doc.text(bill.invoiceNumber, 110, itemY);
      doc.text(bill.customerName.substring(0, 15), 180, itemY);
      doc.text(bill.roomNumber, 280, itemY);
      doc.text(`₹ ${bill.totalAmount.toFixed(2)}`, 330, itemY);
      doc.text(bill.status.toUpperCase(), 400, itemY);

      itemY += 18;
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica').text(
      `Generated on: ${new Date().toLocaleString()}`,
      50,
      doc.y,
      { align: 'center' }
    );
    doc.text('This is a computer generated document', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBill,
  getBills,
  getBillById,
  deleteBill,
  generateBillPDF,
  getDashboardStats,
  getMonthlySummary,
  generateMonthlySummaryPDF,
};
