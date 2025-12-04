const express = require('express');
const patientController = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All patient routes require authentication and patient role
router.use(protect, authorize('patient'));

// Dashboard
router.get('/dashboard', patientController.getDashboard);

// Wellness metrics
router.post('/metrics/log', patientController.logWellnessMetrics);
router.get('/metrics/history', patientController.getWellnessHistory);

// Profile
router.put('/profile', patientController.updateProfile);

// Reminders
router.get('/reminders', patientController.getReminders);
router.put('/reminders/:reminderId/complete', patientController.completeReminder);

module.exports = router;
