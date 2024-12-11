const mongoose = require('mongoose');

const TvSeriesSchema = new mongoose.Schema({
  tmdbId: { type: String },
  title: { type: String, required: true },
  slug: { type: String, required: true }, // Removed `unique: true`
  description: { type: String },
  actors: { type: String },
  directors: { type: String },
  writers: { type: String },
  imdbRating: { type: String },
  releaseDate: { type: Date },
  countries: { type: String, default: 'India' },
  genres: { type: String },
  runtime: { type: String },
  freePaid: { type: String, enum: ['Free', 'Paid'], default: 'Paid' },
  trailerUrl: { type: String },
  imdbRating: { type: String }, 
  videoQuality: { type: String, default: '4K' },
  thumbnail: { type: String },
  poster: { type: String },
  sendNewsletter: { type: Boolean, default: false },
  sendPushNotification: { type: Boolean, default: false },
  publish: { type: Boolean, default: false },
  enableDownload: { type: Boolean, default: false },
}, { timestamps: true });

const TvSeries = mongoose.model('TvSeries', TvSeriesSchema);

module.exports = TvSeries;
