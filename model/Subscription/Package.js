// models/packageModel.js

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
  },
  validity: {
    type: Number, // Ensure this is a Number
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: { 
    type: String // Optional
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
