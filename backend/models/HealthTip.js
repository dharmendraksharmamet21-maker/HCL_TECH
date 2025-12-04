const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['nutrition', 'exercise', 'mental-health', 'sleep', 'stress-management', 'preventive-care', 'general'],
    required: true
  },
  author: String,
  source: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HealthTip = mongoose.model('HealthTip', healthTipSchema);

module.exports = HealthTip;
