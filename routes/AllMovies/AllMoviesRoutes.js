const express = require('express');
const Movie = require('../../model/AllMovies/AllMoviesModel');
const router = express.Router();

// Create a new movie
router.post('/', async (req, res) => {
  try {
    const movieData = { ...req.body };
    if (!movieData.tmdbId) delete movieData.tmdbId; // Remove tmdbId if it's empty

    const movie = new Movie(movieData);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a movie
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/count', async (req, res) => {
  console.log(req.params); // Log request parameters
  try {
    // Count the number of documents where _id exists
    const count = await Movie.countDocuments({ _id: { $exists: true } });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie count', error });
  }
});


module.exports = router;
