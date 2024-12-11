// models/ProgramGuide.js
const mongoose = require('mongoose');

const programGuideSchema = new mongoose.Schema({
  tvChannel: { type: String, required: true },
  programTitle: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['Upcoming', 'Aired'], required: true },
  status: { type: String, enum: ['Publish', 'Unpublish'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('ProgramGuide', programGuideSchema);
