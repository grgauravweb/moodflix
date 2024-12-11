const express = require('express');
const TopRatedMovie = require('../../model/MainDashboard/TopRatedMovieModel');

const router = express.Router();

// Get all top rated movies
router.get('/', async (req, res) => {
  try {
    const movies = await TopRatedMovie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add multiple top rated movies
router.post('/', async (req, res) => {
  const moviesData = req.body; // Expecting an array of movie objects

  // Validate if moviesData is an array
  if (!Array.isArray(moviesData)) {
    return res.status(400).json({ message: 'Data should be an array of movies.' });
  }

  try {
    const savedMovies = await TopRatedMovie.insertMany(moviesData);
    res.status(201).json(savedMovies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
