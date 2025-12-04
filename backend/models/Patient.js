const mongoose = require('mongoose');
const User = require('./User');

const patientSchema = new mongoose.Schema({
  // Additional patient-specific fields
  allergies: [{
    type: String,
    trim: true
  }],
  medications: [{
    name: {
      type: String,
      trim: true
    },
    dosage: String,
    frequency: String
  }],
  chronicConditions: [{
    type: String,
    trim: true
  }],
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relationship: String,
    phone: String
  },
  bloodType: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'],
    default: 'Unknown'
  },
  height: {
    type: Number,
    min: 50,
    max: 300
  }, // in cm
  weight: {
    type: Number,
    min: 20,
    max: 500
  }, // in kg
  assignedProviders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }],
  lastWellnessCheckup: Date,
  wearableDeviceConnected: {
    type: Boolean,
    default: false
  },
  wearableDeviceType: String // e.g., 'FitBit', 'Apple Watch', etc.
});

const Patient = User.discriminator('patient', patientSchema);

module.exports = Patient;
