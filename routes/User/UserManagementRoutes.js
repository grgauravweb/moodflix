const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../model/User/UserManagementModal');

const router = express.Router();

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
