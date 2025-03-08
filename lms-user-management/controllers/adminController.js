const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Get user activity logs
exports.getUserActivity = async (req, res) => {
    try {
        const users = await User.find({}, 'name email lastLogin');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get enrollment statistics
exports.getEnrollmentStats = async (req, res) => {
    try {
        const enrollments = await Enrollment.aggregate([
            { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]);
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get revenue reports
exports.getRevenueReports = async (req, res) => {
    try {
        const transactions = await Transaction.find({}, 'amount date');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get performance insights
exports.getPerformanceInsights = async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' }, 'name coursesTaught');
        res.json(instructors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Send system-wide notifications
exports.sendNotification = async (req, res) => {
    try {
        const { title, message } = req.body;
        const notification = new Notification({ title, message });
        await notification.save();
        res.json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
