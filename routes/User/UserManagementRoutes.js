const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User/UserManagementModal');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, // Payload
      process.env.JWT_SECRET, // Replace with your secret key
      { expiresIn: '1h' } // Token expiry
    );
    
    // Respond with the token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to authenticate the user based on the JWT token
const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header (Bearer token)
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach the userId (from decoded token) to the request object for further use
    req.userId = decoded.userId;
    next();
  });
};

// Route to get the user details using the JWT token
router.get('/get-user', authenticateToken, async (req, res) => {
  try {
    // Find the user by the userId from the token
    const user = await User.findById(req.userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user details (without password)
    res.json({ message: 'User retrieved successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST method to create a new user
router.post('/', async (req, res) => {
  const { fullName, email, role, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName,
    email,
    role,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error saving user:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error' });
    }
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// GET method to fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Edit user
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, role, password },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
