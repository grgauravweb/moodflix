const express = require("express");
const router = express.Router();
const Notification = require("../../model/Notification/LiveTvModel");

// Route to create a new notification
router.post("/", async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to fetch the latest notification data
router.get("/latest", async (req, res) => {
  try {
    const latestNotification = await Notification.findOne().sort({ createdAt: -1 });
    res.json(latestNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
