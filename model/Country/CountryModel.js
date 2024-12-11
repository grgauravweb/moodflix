// models/Country.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // Store the Base64 image
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Published', 'Unpublished'],
    default: 'Published',
  },
}, { timestamps: true });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
