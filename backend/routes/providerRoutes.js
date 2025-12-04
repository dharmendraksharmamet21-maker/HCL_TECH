const express = require('express');
const providerController = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All provider routes require authentication and provider role
router.use(protect, authorize('provider'));

// Dashboard
router.get('/dashboard', providerController.getDashboard);

// Patients
router.get('/patients', providerController.getAssignedPatients);
router.get('/patients/:patientId', providerController.getPatientDetails);
router.post('/patients/assign', providerController.assignPatient);

// Reminders
router.post('/reminders', providerController.createReminder);
router.put('/reminders/:reminderId', providerController.updateReminder);

module.exports = router;
