// models/PaymentSetting.js
const mongoose = require("mongoose");

const PaymentSettingSchema = new mongoose.Schema({
  offlineEnabled: { type: Boolean, default: false },
  offlineTitle: { type: String, default: "" },
  offlineInstruction: { type: String, default: "" },
  paypalEnabled: { type: Boolean, default: false },
  paypalEmail: { type: String, default: "" },
  paypalClientId: { type: String, default: "" },
  stripeEnabled: { type: Boolean, default: false },
  stripePublishableKey: { type: String, default: "" },
  stripeSecretKey: { type: String, default: "" },
  razorpayEnabled: { type: Boolean, default: false },
  exchangeRate: { type: Number, default: 1 },
  razorpayKeyId: { type: String, default: "" },
  razorpayKeySecret: { type: String, default: "" },
});

module.exports = mongoose.model("PaymentSetting", PaymentSettingSchema);
