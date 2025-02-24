const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: String },
  title: { type: String, required: true },
  slug: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }], // Removed `unique: true`
  description: { type: String },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Star" }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Star" }],
  writers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Star" }],
  imdbRating: { type: String },
  releaseDate: { type: Date },
  countries: { type: String, default: 'India' },
  // genres: { type: String },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  runtime: { type: String },
  freePaid: { type: String, enum: ['Free', 'Paid'], default: 'Paid' },
  trailerUrl: { type: String },
  movieUrl: { type: String },
  videoQuality: { type: String, default: '4K' },
  thumbnail: { type: String },
  poster: { type: String },
  sendNewsletter: { type: Boolean, default: false },
  sendPushNotification: { type: Boolean, default: false },
  publish: { type: Boolean, default: false },
  enableDownload: { type: Boolean, default: false },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
