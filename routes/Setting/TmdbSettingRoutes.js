const express = require("express");
const router = express.Router();
const TmdbSetting = require("../../model/Setting/TmdbModel");

// Get TMDB settings
router.get("/", async (req, res) => {
  try {
    const settings = await TmdbSetting.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
});

// Save TMDB settings
router.post("/", async (req, res) => {
  try {
    const { apiKey, defaultLanguage, imageGrabBy } = req.body;
    const settings = await TmdbSetting.findOneAndUpdate(
      {},
      { apiKey, defaultLanguage, imageGrabBy },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error saving settings" });
  }
});

module.exports = router;
