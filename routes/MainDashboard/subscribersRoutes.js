const express = require('express');
const Subscriber = require('../../model/MainDashboard/SubscriberModel');

const router = express.Router();

// Get all subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add multiple subscribers
router.post('/', async (req, res) => {
  const subscribersData = req.body; // Expecting an array of subscriber objects

  if (!Array.isArray(subscribersData)) {
    return res.status(400).json({ message: 'Data should be an array of subscribers.' });
  }

  try {
    const savedSubscribers = await Subscriber.insertMany(subscribersData);
    res.status(201).json(savedSubscribers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
