const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Admin Dashboard Routes
router.get('/user-activity', authenticate, authorize('admin'), adminController.getUserActivity);
router.get('/enrollment-stats', authenticate, authorize('admin'), adminController.getEnrollmentStats);
router.get('/revenue-reports', authenticate, authorize('admin'), adminController.getRevenueReports);
router.get('/performance-insights', authenticate, authorize('admin'), adminController.getPerformanceInsights);
router.post('/send-notification', authenticate, authorize('admin'), adminController.sendNotification);

module.exports = router;