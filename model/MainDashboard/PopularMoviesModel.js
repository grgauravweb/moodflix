const mongoose = require('mongoose');

const PopularMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  totalView: {
    type: Number,
    required: true,
  },
});

const PopularMovie = mongoose.model('PopularMovie', PopularMovieSchema);
module.exports = PopularMovie;
