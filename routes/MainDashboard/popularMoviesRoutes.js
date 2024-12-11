const express = require('express');
const PopularMovie = require('../../model/MainDashboard/PopularMoviesModel');

const router = express.Router();

// Get all popular movies
router.get('/', async (req, res) => {
  try {
    const movies = await PopularMovie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add multiple popular movies
router.post('/', async (req, res) => {
  const moviesData = req.body; // Expecting an array of movie objects

  if (!Array.isArray(moviesData)) {
    return res.status(400).json({ message: 'Data should be an array of movies.' });
  }

  try {
    const savedMovies = await PopularMovie.insertMany(moviesData);
    res.status(201).json(savedMovies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
