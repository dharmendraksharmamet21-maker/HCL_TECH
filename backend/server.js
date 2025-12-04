require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
let mongoMemoryServer = null;

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const providerRoutes = require('./routes/providerRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/logger');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Apply stricter auth rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Healthcare Wellness API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/provider', providerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no external URI is provided and we're in development, start an
    // in-memory MongoDB instance so the app can run locally without
    // requiring Docker or a system MongoDB service.
    if (!mongoUri && (process.env.NODE_ENV || 'development') === 'development') {
      try {
        // Lazy-require the memory server only in development to avoid
        // adding runtime overhead in production.
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        mongoUri = mongoMemoryServer.getUri();
        console.log('⚙️  Started in-memory MongoDB for development');
      } catch (memErr) {
        console.error('✗ Failed to start in-memory MongoDB:', memErr.message);
      }
    }

    if (!mongoUri) {
      // Fallback to localhost if nothing else is available
      mongoUri = 'mongodb://localhost:27017/healthcare-wellness';
    }

    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    // In production we should fail fast, but in development keep the server
    // running so health checks and non-DB routes can be used for debugging.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('Continuing without database connection (development mode). Some features will be unavailable.');
    }
  }
};

// Ensure the in-memory server is stopped when the process exits
const cleanup = async () => {
  try {
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      console.log('⚙️  Stopped in-memory MongoDB');
    }
  } catch (e) {
    // ignore
  }
};

process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚑 Healthcare Wellness API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
