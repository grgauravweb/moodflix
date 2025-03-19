// routes/paymentSettings.js
const express = require("express");
const router = express.Router();
const PaymentSetting = require("../../model/Subscription/PayemnetSettingModel");

// POST: Admin creates payment settings
router.post("/", async (req, res) => {
  try {
    const paymentSettings = new PaymentSetting(req.body);
    await paymentSettings.save();

    res.status(201).json({
      message: "Payment settings saved successfully",
      paymentSettings,
    });
  } catch (error) {
    console.error("Error saving payment settings:", error);
    res.status(500).json({ message: "Failed to save payment settings" });
  }
});

// GET: Fetch Payment Setting
router.get("/", async (req, res) => {
  try {
    const paymentSettings = await PaymentSetting.findOne();
    if (!paymentSettings) {
      return res.status(404).json({ message: "Payment settings not found" });
    }
    res.status(200).json(paymentSettings);
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({ message: "Failed to fetch payment settings" });
  }
});

// Update payment settings
router.put("/:id", async (req, res) => {
  try {
    const updatedSettings = await PaymentSetting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Payment settings not found" });
    }

    res.status(200).json({
      message: "Payment settings updated successfully",
      updatedSettings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
