const mongoose = require("mongoose");

const transactionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserManage', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  screenshotUrl: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  paymentTime: { type: Date, default: Date.now },
  transactionInfo: { type: String, required: false },
});

module.exports = mongoose.model("TransactionLog", transactionLogSchema);
