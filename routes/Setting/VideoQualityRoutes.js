const express = require("express");
const router = express.Router();
const VideoQuality = require("../../model/Setting/VideoQualityModel");

// GET all video qualities
router.get("/", async (req, res) => {
  try {
    const videoQualities = await VideoQuality.find();
    res.json(videoQualities);
  } catch (error) {
    console.error("Error fetching video qualities:", error);
    res.status(500).json({ message: "Error fetching video qualities" });
  }
});

// POST a new video quality
router.post("/", async (req, res) => {
  const { quality, description } = req.body;

  try {
    const newVideoQuality = new VideoQuality({ quality, description });
    const savedQuality = await newVideoQuality.save();
    res.status(201).json(savedQuality);
  } catch (error) {
    console.error("Error adding video quality:", error);
    res.status(500).json({ message: "Error adding video quality" });
  }
});

// PUT update an existing video quality
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { quality, description } = req.body;

  try {
    const updatedQuality = await VideoQuality.findByIdAndUpdate(
      id,
      { quality, description },
      { new: true }
    );

    if (!updatedQuality) {
      return res.status(404).json({ message: "Video quality not found" });
    }

    res.json(updatedQuality);
  } catch (error) {
    console.error("Error updating video quality:", error);
    res.status(500).json({ message: "Error updating video quality" });
  }
});

// DELETE a video quality
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuality = await VideoQuality.findByIdAndDelete(id);

    if (!deletedQuality) {
      return res.status(404).json({ message: "Video quality not found" });
    }

    res.json({ message: "Video quality deleted successfully" });
  } catch (error) {
    console.error("Error deleting video quality:", error);
    res.status(500).json({ message: "Error deleting video quality" });
  }
});

module.exports = router;
