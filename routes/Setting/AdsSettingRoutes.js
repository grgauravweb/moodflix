const AdsSetting = require("../../model/Setting/AdsSettingModel");
const express = require("express");
const router = express.Router();
// const AdsSetting = require("../model/AdsSettingModel");

// Get ads settings
router.get("/", async (req, res) => {
  try {
    const settings = await AdsSetting.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save ads settings
router.post("/", async (req, res) => {
  try {
    const settings = await AdsSetting.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
