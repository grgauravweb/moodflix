const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['User', 'Admin'] },
  password: { type: String, required: true },
});

const User = mongoose.models.UserManage || mongoose.model('UserManage', userSchema);

module.exports = User;
