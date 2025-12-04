const User = require('../models/User');
const Patient = require('../models/Patient');
const Provider = require('../models/Provider');
const { generateToken, validateEmail } = require('../utils/jwt');

// Register user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm, role, consentGiven } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email' });
    }

    if (!consentGiven) {
      return res.status(400).json({ error: 'Please accept the data usage consent' });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Create user based on role
    let newUser;
    if (role === 'provider') {
      newUser = new Provider({
        firstName,
        lastName,
        email,
        password,
        role: 'provider',
        consentGiven
      });
    } else {
      newUser = new Patient({
        firstName,
        lastName,
        email,
        password,
        role: 'patient',
        consentGiven
      });
    }

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error registering user' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error logging in' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
