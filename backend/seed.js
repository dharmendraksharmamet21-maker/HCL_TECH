require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Provider = require('../models/Provider');
const HealthTip = require('../models/HealthTip');
const PreventiveCareReminder = require('../models/PreventiveCareReminder');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-wellness');
    console.log('✓ MongoDB connected');

    // Clear existing data
    await Patient.deleteMany({});
    await Provider.deleteMany({});
    await HealthTip.deleteMany({});
    await PreventiveCareReminder.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create seed patients
    const patients = await Patient.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'patient',
        consentGiven: true,
        allergies: ['Penicillin'],
        medications: [
          { name: 'Aspirin', dosage: '500mg', frequency: 'Daily' }
        ],
        bloodType: 'O+',
        height: 175,
        weight: 70
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'patient',
        consentGiven: true,
        allergies: [],
        medications: [],
        bloodType: 'A+',
        height: 165,
        weight: 60
      }
    ]);
    console.log(`✓ Created ${patients.length} patients`);

    // Create seed providers
    const providers = await Provider.create([
      {
        firstName: 'Dr',
        lastName: 'Johnson',
        email: 'dr.johnson@example.com',
        password: 'password123',
        role: 'provider',
        consentGiven: true,
        licenseNumber: 'LIC123456',
        specialization: 'General Practice',
        hospitalName: 'City Hospital',
        yearsOfExperience: 10,
        verificationStatus: 'verified'
      },
      {
        firstName: 'Dr',
        lastName: 'Williams',
        email: 'dr.williams@example.com',
        password: 'password123',
        role: 'provider',
        consentGiven: true,
        licenseNumber: 'LIC789012',
        specialization: 'Cardiology',
        hospitalName: 'Heart Center',
        yearsOfExperience: 15,
        verificationStatus: 'verified'
      }
    ]);
    console.log(`✓ Created ${providers.length} providers`);

    // Assign patients to providers
    patients[0].assignedProviders = [providers[0]._id];
    patients[1].assignedProviders = [providers[0]._id, providers[1]._id];
    await patients[0].save();
    await patients[1].save();

    providers[0].assignedPatients = [patients[0]._id, patients[1]._id];
    providers[1].assignedPatients = [patients[1]._id];
    await providers[0].save();
    await providers[1].save();
    console.log('✓ Assigned patients to providers');

    // Create seed health tips
    const healthTips = await HealthTip.create([
      {
        title: 'Stay Hydrated',
        content: 'Drink at least 8 glasses of water daily to maintain proper hydration and support overall health.',
        category: 'nutrition',
        author: 'Health Expert',
        isActive: true
      },
      {
        title: 'Regular Exercise',
        content: 'Aim for at least 150 minutes of moderate-intensity aerobic activity per week.',
        category: 'exercise',
        author: 'Fitness Coach',
        isActive: true
      },
      {
        title: 'Quality Sleep',
        content: 'Get 7-9 hours of quality sleep each night to support immune function and mental health.',
        category: 'sleep',
        author: 'Sleep Specialist',
        isActive: true
      },
      {
        title: 'Stress Management',
        content: 'Practice meditation, deep breathing, or yoga to reduce stress and anxiety.',
        category: 'stress-management',
        author: 'Mental Health Professional',
        isActive: true
      }
    ]);
    console.log(`✓ Created ${healthTips.length} health tips`);

    // Create seed reminders
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const reminders = await PreventiveCareReminder.create([
      {
        patientId: patients[0]._id,
        providerId: providers[0]._id,
        title: 'Annual Health Checkup',
        description: 'Schedule your annual comprehensive health checkup',
        reminderType: 'checkup',
        dueDate: futureDate,
        priority: 'high',
        status: 'upcoming'
      },
      {
        patientId: patients[0]._id,
        providerId: providers[0]._id,
        title: 'Blood Pressure Screening',
        description: 'Get your blood pressure checked',
        reminderType: 'screening',
        dueDate: new Date(),
        priority: 'medium',
        status: 'missed'
      }
    ]);
    console.log(`✓ Created ${reminders.length} reminders`);

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
