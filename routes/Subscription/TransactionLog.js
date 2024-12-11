const express = require("express");
const router = express.Router();
const TransactionLog = require("../../model/Subscription/TransactionLog");

// POST route for creating a transaction log (dummy data posting)
router.post("/", async (req, res) => {
  try {
    const newLog = new TransactionLog(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route for fetching transaction logs
router.get("/", async (req, res) => {
  try {
    const logs = await TransactionLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
