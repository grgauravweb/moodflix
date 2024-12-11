// routes/paymentSettings.js
const express = require("express");
const router = express.Router();
const PaymentSetting = require("../../model/Subscription/PayemnetSettingModel");

// POST: Save Payment Setting
router.post("/", async (req, res) => {
  try {
    const setting = await PaymentSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(setting);
  } catch (error) {
    console.error("Error saving payment settings:", error);
    res.status(500).json({ message: "Failed to save payment settings" });
  }
});

// GET: Fetch Payment Setting
router.get("/", async (req, res) => {
  try {
    const setting = await PaymentSetting.findOne({});
    res.json(setting || {});
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({ message: "Failed to fetch payment settings" });
  }
});

module.exports = router;
