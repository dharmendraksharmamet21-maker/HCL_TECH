const Provider = require('../models/Provider');
const Patient = require('../models/Patient');
const PreventiveCareReminder = require('../models/PreventiveCareReminder');
const WellnessMetric = require('../models/WellnessMetric');

// Get provider dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const providerId = req.user.id;

    // Get provider's assigned patients
    const provider = await Provider.findById(providerId).populate('assignedPatients');
    const assignedPatients = provider.assignedPatients || [];

    // Get compliance status for all assigned patients
    const complianceData = await Promise.all(
      assignedPatients.map(async (patient) => {
        const totalReminders = await PreventiveCareReminder.countDocuments({ patientId: patient._id });
        const completedReminders = await PreventiveCareReminder.countDocuments({
          patientId: patient._id,
          status: 'completed'
        });
        const missedReminders = await PreventiveCareReminder.countDocuments({
          patientId: patient._id,
          status: 'missed'
        });

        return {
          patientId: patient._id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          totalReminders,
          completedReminders,
          missedReminders,
          compliancePercentage: totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0,
          adherenceStatus: missedReminders > 0 ? 'low' : 'high'
        };
      })
    );

    // Get high-priority reminders for assigned patients
    const patientIds = assignedPatients.map(p => p._id);
    const upcomingReminders = await PreventiveCareReminder.find({
      patientId: { $in: patientIds },
      status: 'upcoming',
      priority: 'high'
    }).populate('patientId', 'firstName lastName').sort({ dueDate: 1 });

    const missedReminders = await PreventiveCareReminder.find({
      patientId: { $in: patientIds },
      status: 'missed'
    }).populate('patientId', 'firstName lastName').sort({ dueDate: 1 });

    res.status(200).json({
      totalPatients: assignedPatients.length,
      complianceData,
      upcomingHighPriorityReminders: upcomingReminders,
      missedReminders,
      provider: {
        firstName: provider.firstName,
        lastName: provider.lastName,
        specialization: provider.specialization
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assigned patients
exports.getAssignedPatients = async (req, res) => {
  try {
    const providerId = req.user.id;

    const provider = await Provider.findById(providerId)
      .populate({
        path: 'assignedPatients',
        select: 'firstName lastName email phone dateOfBirth gender bloodType'
      });

    res.status(200).json({
      patients: provider.assignedPatients || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patient details
exports.getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;
    const providerId = req.user.id;

    // Verify provider has access to this patient
    const provider = await Provider.findById(providerId);
    const hasAccess = provider.assignedPatients.includes(patientId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'You do not have access to this patient' });
    }

    const patient = await Patient.findById(patientId);
    
    // Get patient's wellness metrics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const metrics = await WellnessMetric.find({
      patientId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    // Get patient's reminders
    const reminders = await PreventiveCareReminder.find({ patientId }).sort({ dueDate: -1 });

    res.status(200).json({
      patient: patient.toJSON(),
      recentMetrics: metrics,
      reminders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create preventive care reminder
exports.createReminder = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { patientId, title, description, reminderType, dueDate, priority } = req.body;

    // Verify provider has access to this patient
    const provider = await Provider.findById(providerId);
    const hasAccess = provider.assignedPatients.includes(patientId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'You do not have access to this patient' });
    }

    const reminder = new PreventiveCareReminder({
      patientId,
      providerId,
      title,
      description: description || '',
      reminderType,
      dueDate,
      priority: priority || 'medium',
      status: 'upcoming'
    });

    await reminder.save();

    res.status(201).json({
      message: 'Reminder created successfully',
      reminder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update reminder status
exports.updateReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const { status, notes } = req.body;
    const providerId = req.user.id;

    const reminder = await PreventiveCareReminder.findById(reminderId);

    if (!reminder || reminder.providerId.toString() !== providerId) {
      return res.status(403).json({ error: 'You do not have access to this reminder' });
    }

    reminder.status = status || reminder.status;
    reminder.notes = notes || reminder.notes;
    reminder.updatedAt = new Date();

    if (status === 'completed') {
      reminder.completionDate = new Date();
    }

    await reminder.save();

    res.status(200).json({
      message: 'Reminder updated successfully',
      reminder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign patient to provider
exports.assignPatient = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { patientId } = req.body;

    const provider = await Provider.findById(providerId);
    const patient = await Patient.findById(patientId);

    if (!provider || !patient) {
      return res.status(404).json({ error: 'Provider or Patient not found' });
    }

    // Add patient to provider's list if not already there
    if (!provider.assignedPatients.includes(patientId)) {
      provider.assignedPatients.push(patientId);
    }

    // Add provider to patient's list if not already there
    if (!patient.assignedProviders.includes(providerId)) {
      patient.assignedProviders.push(providerId);
    }

    await provider.save();
    await patient.save();

    res.status(200).json({
      message: 'Patient assigned successfully',
      provider: provider.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
