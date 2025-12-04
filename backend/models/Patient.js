const mongoose = require('mongoose');
const User = require('./User');

const patientSchema = new mongoose.Schema({
  // Additional patient-specific fields
  allergies: [{
    type: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  chronicConditions: [{
    type: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  bloodType: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'],
    default: 'Unknown'
  },
  height: Number, // in cm
  weight: Number, // in kg
  assignedProviders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }]
});

const Patient = User.discriminator('patient', patientSchema);

module.exports = Patient;
