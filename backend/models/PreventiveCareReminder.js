const mongoose = require('mongoose');

const preventiveCareReminderSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  reminderType: {
    type: String,
    enum: ['vaccination', 'screening', 'checkup', 'lab-test', 'dental', 'eye-exam', 'other'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completionDate: Date,
  status: {
    type: String,
    enum: ['upcoming', 'missed', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notificationSent: {
    type: Boolean,
    default: false
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
preventiveCareReminderSchema.index({ patientId: 1, dueDate: 1 });
preventiveCareReminderSchema.index({ providerId: 1, dueDate: 1 });

const PreventiveCareReminder = mongoose.model('PreventiveCareReminder', preventiveCareReminderSchema);

module.exports = PreventiveCareReminder;
