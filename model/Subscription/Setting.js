const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  currencySymbol: String,
  currency: String,
  exchangeRate: Number,
  onlineExchangeRate: Boolean,
  showRibbonForPaidContent: Boolean,
  trialFunctionality: Boolean,
  trialPeriodDays: Number,
});

module.exports = mongoose.model("Setting", settingSchema);
