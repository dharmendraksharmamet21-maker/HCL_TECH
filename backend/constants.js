// User roles
const USER_ROLES = {
  PATIENT: 'patient',
  PROVIDER: 'provider',
  ADMIN: 'admin'
};

// Wellness metric goals
const WELLNESS_GOALS = {
  STEPS: 8000,
  SLEEP: 8,
  WATER: 2,
  ACTIVE_TIME: 30
};

// Reminder types
const REMINDER_TYPES = {
  VACCINATION: 'vaccination',
  SCREENING: 'screening',
  CHECKUP: 'checkup',
  LAB_TEST: 'lab-test',
  DENTAL: 'dental',
  EYE_EXAM: 'eye-exam',
  OTHER: 'other'
};

// Reminder statuses
const REMINDER_STATUS = {
  UPCOMING: 'upcoming',
  MISSED: 'missed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Priority levels
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Health tip categories
const HEALTH_TIP_CATEGORIES = {
  NUTRITION: 'nutrition',
  EXERCISE: 'exercise',
  MENTAL_HEALTH: 'mental-health',
  SLEEP: 'sleep',
  STRESS_MANAGEMENT: 'stress-management',
  PREVENTIVE_CARE: 'preventive-care',
  GENERAL: 'general'
};

// Gender options
const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer-not-to-say'
};

// Blood types
const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'];

module.exports = {
  USER_ROLES,
  WELLNESS_GOALS,
  REMINDER_TYPES,
  REMINDER_STATUS,
  PRIORITY,
  HEALTH_TIP_CATEGORIES,
  GENDER,
  BLOOD_TYPES
};
