const mongoose = require('mongoose');

// 🆕 Episode Schema
const EpisodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  episodeNumber: { type: Number, required: true },
  seasonNumber: { type: Number, required: true },
  description: { type: String },
  video: { type: String, required: true },
  thumbnail: { type: String },
  duration: { type: String },
  releaseDate: { type: Date },
  freePaid: { type: String, enum: ['Free', 'Paid'], default: 'Paid' },
  videoQuality: { type: String, enum: ['4K', '1080p', '720p'], default: '4K' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [
    {
      user: { type: String },
      comment: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const TvSeriesSchema = new mongoose.Schema({
  tmdbId: { type: String },
  title: { type: String, required: true },
  slug: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }], // Removed `unique: true`
  description: { type: String },
  seasonNumber: { type: Number, required: true, default: 1 },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Star" }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Star" }],
  writers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Star" }],
  imdbRating: { type: String },
  releaseDate: { type: Date },
  countries: { type: String, default: 'India' },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
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
  episodes: [EpisodeSchema],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const TvSeries = mongoose.model('TvSeries', TvSeriesSchema);

module.exports = TvSeries;
