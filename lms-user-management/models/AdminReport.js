// Example Schema for Logging)
const mongoose = require('mongoose');
const AdminReportSchema = new mongoose.Schema({
    reportType: { type: String, required: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminReport', AdminReportSchema);