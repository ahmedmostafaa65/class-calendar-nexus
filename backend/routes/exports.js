
const express = require('express');
const router = express.Router();
const { format, parse, isValid } = require('date-fns');

const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const { generatePDF, generateCSV } = require('../utils/exportUtils');

/**
 * @route   GET api/export/bookings/pdf
 * @desc    Export bookings as PDF
 * @access  Private/Admin
 */
router.get('/bookings/pdf', protect, authorize('admin'), async (req, res) => {
  try {
    // Query parameters
    const { status, startDate, endDate, classroomId } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status && ['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }
    
    // Filter by classroom
    if (classroomId) {
      query.classroomId = classroomId;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const parsedStartDate = parse(startDate, 'yyyy-MM-dd', new Date());
        if (isValid(parsedStartDate)) {
          query.date.$gte = format(parsedStartDate, 'yyyy-MM-dd');
        }
      }
      if (endDate) {
        const parsedEndDate = parse(endDate, 'yyyy-MM-dd', new Date());
        if (isValid(parsedEndDate)) {
          query.date.$lte = format(parsedEndDate, 'yyyy-MM-dd');
        }
      }
    }
    
    // Fetch bookings
    const bookings = await Booking.find(query).sort({ date: 1, startTime: 1 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.pdf');
    
    // Generate PDF
    generatePDF(bookings, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

/**
 * @route   GET api/export/bookings/csv
 * @desc    Export bookings as CSV
 * @access  Private/Admin
 */
router.get('/bookings/csv', protect, authorize('admin'), async (req, res) => {
  try {
    // Query parameters
    const { status, startDate, endDate, classroomId } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status && ['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }
    
    // Filter by classroom
    if (classroomId) {
      query.classroomId = classroomId;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const parsedStartDate = parse(startDate, 'yyyy-MM-dd', new Date());
        if (isValid(parsedStartDate)) {
          query.date.$gte = format(parsedStartDate, 'yyyy-MM-dd');
        }
      }
      if (endDate) {
        const parsedEndDate = parse(endDate, 'yyyy-MM-dd', new Date());
        if (isValid(parsedEndDate)) {
          query.date.$lte = format(parsedEndDate, 'yyyy-MM-dd');
        }
      }
    }
    
    // Fetch bookings
    const bookings = await Booking.find(query).sort({ date: 1, startTime: 1 });
    
    // Generate CSV
    generateCSV(bookings, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate CSV report' });
  }
});

/**
 * @route   GET api/export/user-bookings/pdf/:userId
 * @desc    Export user bookings as PDF
 * @access  Private
 */
router.get('/user-bookings/pdf/:userId', protect, async (req, res) => {
  try {
    // Check if user is admin or requesting their own bookings
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Fetch user bookings
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ date: 1, startTime: 1 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=my-bookings.pdf');
    
    // Generate PDF
    generatePDF(bookings, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

/**
 * @route   GET api/export/user-bookings/csv/:userId
 * @desc    Export user bookings as CSV
 * @access  Private
 */
router.get('/user-bookings/csv/:userId', protect, async (req, res) => {
  try {
    // Check if user is admin or requesting their own bookings
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Fetch user bookings
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ date: 1, startTime: 1 });
    
    // Generate CSV
    generateCSV(bookings, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate CSV report' });
  }
});

module.exports = router;
