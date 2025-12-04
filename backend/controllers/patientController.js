const Patient = require('../models/Patient');
const WellnessMetric = require('../models/WellnessMetric');
const PreventiveCareReminder = require('../models/PreventiveCareReminder');
const HealthTip = require('../models/HealthTip');

// Get patient dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const patientId = req.user.id;
    
    // Get today's wellness metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMetric = await WellnessMetric.findOne({
      patientId,
      date: { $gte: today, $lt: tomorrow }
    });

    // Get this week's metrics
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekMetrics = await WellnessMetric.find({
      patientId,
      date: { $gte: weekAgo, $lt: tomorrow }
    }).sort({ date: -1 });

    // Get preventive care reminders
    const upcomingReminders = await PreventiveCareReminder.find({
      patientId,
      status: 'upcoming',
      dueDate: { $gte: new Date() }
    }).limit(5).sort({ dueDate: 1 });

    const missedReminders = await PreventiveCareReminder.find({
      patientId,
      status: 'missed'
    }).limit(5);

    // Get random health tip
    const tips = await HealthTip.find({ isActive: true });
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    // Get patient profile
    const patient = await Patient.findById(patientId);

    res.status(200).json({
      todayMetric: todayMetric || {},
      weekMetrics,
      upcomingReminders,
      missedReminders,
      healthTip: randomTip,
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        profilePicture: patient.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Log wellness metrics
exports.logWellnessMetrics = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { steps, sleepHours, waterIntake, activeTime, caloriesBurned, heartRate, bloodPressure, notes } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let metric = await WellnessMetric.findOne({
      patientId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (metric) {
      // Update existing metric for today
      metric.steps = steps || metric.steps;
      metric.sleepHours = sleepHours || metric.sleepHours;
      metric.waterIntake = waterIntake || metric.waterIntake;
      metric.activeTime = activeTime || metric.activeTime;
      metric.caloriesBurned = caloriesBurned || metric.caloriesBurned;
      metric.heartRate = heartRate || metric.heartRate;
      if (bloodPressure) {
        metric.bloodPressure = bloodPressure;
      }
      metric.notes = notes || metric.notes;
      metric.updatedAt = new Date();
    } else {
      // Create new metric
      metric = new WellnessMetric({
        patientId,
        steps: steps || 0,
        sleepHours: sleepHours || 0,
        waterIntake: waterIntake || 0,
        activeTime: activeTime || 0,
        caloriesBurned: caloriesBurned || 0,
        heartRate: heartRate || null,
        bloodPressure: bloodPressure || null,
        notes: notes || ''
      });
    }

    await metric.save();

    res.status(201).json({
      message: 'Wellness metrics logged successfully',
      metric
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get wellness history
exports.getWellnessHistory = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await WellnessMetric.find({
      patientId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.status(200).json({
      metrics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update patient profile
exports.updateProfile = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { allergies, medications, chronicConditions, emergencyContact, bloodType, height, weight } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        allergies: allergies || patient.allergies,
        medications: medications || patient.medications,
        chronicConditions: chronicConditions || patient.chronicConditions,
        emergencyContact: emergencyContact || patient.emergencyContact,
        bloodType: bloodType || patient.bloodType,
        height: height || patient.height,
        weight: weight || patient.weight,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      patient: patient.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get preventive care reminders
exports.getReminders = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { status } = req.query;

    let query = { patientId };
    if (status) {
      query.status = status;
    }

    const reminders = await PreventiveCareReminder.find(query)
      .populate('providerId', 'firstName lastName specialization')
      .sort({ dueDate: 1 });

    res.status(200).json({
      reminders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark reminder as completed
exports.completeReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const patientId = req.user.id;

    const reminder = await PreventiveCareReminder.findByIdAndUpdate(
      reminderId,
      {
        status: 'completed',
        completionDate: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!reminder || reminder.patientId.toString() !== patientId) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.status(200).json({
      message: 'Reminder marked as completed',
      reminder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
