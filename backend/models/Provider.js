const mongoose = require('mongoose');
const User = require('./User');

const providerSchema = new mongoose.Schema({
  // Additional provider-specific fields
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  hospitalName: {
    type: String,
    trim: true
  },
  clinicAddress: String,
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 70
  },
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
});

// Index for efficient queries
providerSchema.index({ specialization: 1, verificationStatus: 1 });

const Provider = User.discriminator('provider', providerSchema);

module.exports = Provider;
