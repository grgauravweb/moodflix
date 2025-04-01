// routes/packageRoutes.js
const express = require('express');
const Package = require('../../model/Subscription/Package');
const Subscription = require('../../model/Subscription/SubscriptionsModel');
const TransactionLog = require('../../model/Subscription/TransactionLog');

const router = express.Router();

// Admin updates transaction status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await TransactionLog.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (status === "Approved") {
      // Create Subscription
      const selectedPackage = await Package.findById(transaction.package);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(selectedPackage.validity));

      const subscription = new Subscription({
        user: transaction.user,
        package: transaction.package,
        startDate,
        endDate,
        status: "Active",
      });

      await subscription.save();

      transaction.status = "Approved";
      await transaction.save();

      return res.status(200).json({
        message: "Transaction approved, subscription activated.",
        subscription,
      });
    } else if (status === "Rejected") {
      transaction.status = "Rejected";
      await transaction.save();
      return res.status(200).json({ message: "Transaction rejected." });
    }

    res.status(400).json({ message: "Invalid status update" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

router.get('/check-subscription/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  try {
      const activeSubscription = await Subscription.findOne({
          user: userId,
          status: 'Active',
      });

      if (!activeSubscription) {
          return res.status(403).json({ activeSubscription: false });
      }

      return res.status(200).json({ activeSubscription: true });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;
