// models/tvChannelModel.js
const mongoose = require('mongoose');

const tvChannelSchema = new mongoose.Schema({
  tvName: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  streamFrom: { type: String, default: 'HLS' },
  label: { type: String, default: 'HD' },
  streamUrl: { type: String },
  streamFromOptional1: { type: String, default: 'HLS' },
  labelOptional1: { type: String, default: 'SD' },
  streamUrlOptional1: { type: String },
  streamFromOptional2: { type: String, default: 'HLS' },
  labelOptional2: { type: String, default: 'LQ' },
  streamUrlOptional2: { type: String },
  freePaid: { type: String, enum: ['Free', 'Paid'], default: 'Paid' },
  thumbnail: { type: String }, // Store as base64
  poster: { type: String },    // Store as base64
  publish: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('TvChannel', tvChannelSchema);
