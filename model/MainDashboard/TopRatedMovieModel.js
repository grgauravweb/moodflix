const mongoose = require('mongoose');

const topRatedMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  totalRating: {
    type: Number,
    required: true,
  },
});

const TopRatedMovie = mongoose.model('TopRatedMovie', topRatedMovieSchema);
module.exports = TopRatedMovie;
