const mongoose = require('mongoose');

const starSchema = new mongoose.Schema({
  starType: { type: String, required: true },
  starName: { type: String, required: true },
  starBio: { type: String, required: true },
  starImage: { type: String },
  tmdbId: { type: String },
  tmdbType: { type: String },
});

module.exports = mongoose.model('Star', starSchema);
