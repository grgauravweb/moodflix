const express = require("express");
const router = express.Router();
const TransactionLog = require("../../model/Subscription/TransactionLog");

// POST route for User submits payment proof
router.post("/", async (req, res) => {
  try {
    const { user, package, paymentMethod, amount, transactionId, screenshotUrl, transactionInfo } = req.body;
    const newLog = new TransactionLog({
      user,
      package,
      paymentMethod,
      amount,
      transactionId,
      screenshotUrl,
      transactionInfo,
      status: "Pending"
    });

    const savedLog = await newLog.save();

    res.status(201).json({
      message: "Transaction submitted. Waiting for admin approval.",
      savedLog
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route for fetching transaction logs
router.get("/", async (req, res) => {
  try {
    const logs = await TransactionLog.find().populate("user package").sort({ paymentTime: -1 })
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const transactions = await TransactionLog.find({ user: userId }).populate("package");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
