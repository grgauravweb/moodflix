// models/Genre.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Published', 'Unpublished'], default: 'Published' },
  icon: { type: String }, // Store the base64 image data
});

module.exports = mongoose.model('Genre', genreSchema);
