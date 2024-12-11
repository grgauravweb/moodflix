// models/packageModel.js

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
  },
  validity: {
    type: String, // Ensure this is a String
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
