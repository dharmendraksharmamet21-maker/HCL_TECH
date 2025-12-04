const mongoose = require('mongoose');
const User = require('./User');

const providerSchema = new mongoose.Schema({
  // Additional provider-specific fields
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  hospitalName: String,
  clinicAddress: String,
  yearsOfExperience: Number,
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
});

const Provider = User.discriminator('provider', providerSchema);

module.exports = Provider;
