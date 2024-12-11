// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const router = express.Router();

// Sample user for demonstration
const sampleUser = {
  email: 'test@example.com',
  password: 'password123',
};

// Endpoint to register a sample user (for testing)
router.post('/register', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;  // Expecting secretKey in the request body

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object including the secretKey
    const user = new User({
      email,
      password: hashedPassword,
      secretKey,  // Save the secretKey as well
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword, secretKey } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the secret key matches
    if (user.secretKey !== secretKey) {
      return res.status(400).json({ message: 'Invalid secret key' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
  

module.exports = router;
