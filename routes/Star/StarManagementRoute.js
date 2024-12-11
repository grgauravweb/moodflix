const express = require("express");
const router = express.Router();
const Star = require("../../model/Star/StarManagementModel");

// Route to get all stars
router.get("/", async (req, res) => {
  try {
    const stars = await Star.find();
    res.json(stars);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stars" });
  }
});

// Route to save a star
router.post("/", async (req, res) => {
  try {
    const { starType, starName, starBio, starImage, tmdbId, tmdbType } =
      req.body;
    const newStar = new Star({
      starType,
      starName,
      starBio,
      starImage,
      tmdbId,
      tmdbType,
    });
    await newStar.save();
    res.status(201).json(newStar);
  } catch (error) {
    res.status(500).json({ error: "Error saving star" });
  }
});

// Update an existing star
router.put('/:id', async (req, res) => {
  try {
      const updatedStar = await Star.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedStar);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Delete a star
router.delete('/:id', async (req, res) => {
  try {
      await Star.findByIdAndDelete(req.params.id);
      res.status(204).json();
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Fetch star from TMDB
router.get('/stars/fetch-from-tmdb/:tmdbId', async (req, res) => {
  // Add your TMDB API call logic here
});

module.exports = router;
