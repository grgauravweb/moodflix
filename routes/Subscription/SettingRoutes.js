const Setting = require("../../model/Subscription/Setting");
const express = require("express");
const router = express.Router();


// Save or update settings
router.post("/", async (req, res) => {
  try {
    const {
      currencySymbol = "₹",
      currency = "INR",
      exchangeRate = 1,
      onlineExchangeRate = false,
      showRibbonForPaidContent = false,
      trialFunctionality = false,
      trialPeriodDays = 7,
    } = req.body;

    // Find existing settings document or create a new one if none exists
    let settings = await Setting.findOne();
    if (settings) {
      // Update existing settings
      settings.currencySymbol = currencySymbol;
      settings.currency = currency;
      settings.exchangeRate = exchangeRate;
      settings.onlineExchangeRate = onlineExchangeRate;
      settings.showRibbonForPaidContent = showRibbonForPaidContent;
      settings.trialFunctionality = trialFunctionality;
      settings.trialPeriodDays = trialPeriodDays;
    } else {
      // Create new settings document with all fields
      settings = new Setting({
        currencySymbol,
        currency,
        exchangeRate,
        onlineExchangeRate,
        showRibbonForPaidContent,
        trialFunctionality,
        trialPeriodDays,
      });
    }

    await settings.save();
    res.status(200).json({ message: "Settings saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving settings" });
  }
});

module.exports = router;
