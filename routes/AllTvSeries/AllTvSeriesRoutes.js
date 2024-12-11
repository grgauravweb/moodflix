const express = require('express');
const TvSeries = require('../../model/AllTvSeries/AllTvSeriesModel'); // Adjust the path to your TV Series model
const router = express.Router();

// Create a new movie
router.post('/', async (req, res) => {
  try {
    const TVSeriesData = { ...req.body };
    if (!TVSeriesData.tmdbId) delete TVSeriesData.tmdbId; // Remove tmdbId if it's empty

    const movie = new TvSeries(TVSeriesData);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all TV Series
router.get('/', async (req, res) => {
  try {
    const tvSeriesList = await TvSeries.find();
    res.status(200).json(tvSeriesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a TV Series by ID
router.get('/:id', async (req, res) => {
  try {
    const tvSeries = await TvSeries.findById(req.params.id);
    if (!tvSeries) {
      return res.status(404).json({ message: 'TV Series not found' });
    }
    res.status(200).json(tvSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a TV Series
router.put('/:id', async (req, res) => {
  try {
    const tvSeries = await TvSeries.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tvSeries) {
      return res.status(404).json({ message: 'TV Series not found' });
    }
    res.status(200).json(tvSeries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a TV Series
router.delete('/:id', async (req, res) => {
  try {
    const tvSeries = await TvSeries.findByIdAndDelete(req.params.id);
    if (!tvSeries) {
      return res.status(404).json({ message: 'TV Series not found' });
    }
    res.status(200).json({ message: 'TV Series deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
