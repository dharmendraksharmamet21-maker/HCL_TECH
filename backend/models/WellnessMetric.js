const mongoose = require('mongoose');

const wellnessMetricSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  steps: {
    type: Number,
    default: 0
  },
  stepGoal: {
    type: Number,
    default: 8000
  },
  sleepHours: {
    type: Number,
    default: 0
  },
  sleepGoal: {
    type: Number,
    default: 8
  },
  waterIntake: {
    type: Number,
    default: 0, // in liters
    min: 0
  },
  waterGoal: {
    type: Number,
    default: 2, // liters
    min: 0
  },
  activeTime: {
    type: Number,
    default: 0 // in minutes
  },
  activeTimeGoal: {
    type: Number,
    default: 30 // minutes
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  heartRate: {
    type: Number,
    default: null
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
wellnessMetricSchema.index({ patientId: 1, date: -1 });

const WellnessMetric = mongoose.model('WellnessMetric', wellnessMetricSchema);

module.exports = WellnessMetric;
