const mongoose = require("mongoose");

const transactionLogSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Or ref to User model if exists
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentTime: { type: Date, default: Date.now },
  transactionInfo: { type: String, required: true },
});

module.exports = mongoose.model("TransactionLog", transactionLogSchema);
