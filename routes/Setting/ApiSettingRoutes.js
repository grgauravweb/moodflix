// routes/apiSettingRoutes.js
const express = require("express");
const router = express.Router();
const ApiSetting = require("../../model/Setting/ApiSettingModel");
const crypto = require("crypto");

// Fetch current API settings
router.get("/", async (req, res) => {
  try {
    const settings = await ApiSetting.findOne();
    if (!settings) return res.status(404).json({ message: "Settings not found" });
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save updated API settings
router.post("/", async (req, res) => {
  const { apiServerUrl, apiKey } = req.body;
  try {
    let settings = await ApiSetting.findOne();
    if (!settings) {
      settings = new ApiSetting({ apiServerUrl, apiKey });
    } else {
      settings.apiServerUrl = apiServerUrl;
      settings.apiKey = apiKey;
    }
    await settings.save();
    res.json({ message: "Settings saved successfully!" });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate a new API key
router.post("/", async (req, res) => {
  try {
    const newApiKey = crypto.randomBytes(12).toString("hex");
    let settings = await ApiSetting.findOne();
    if (!settings) {
      settings = new ApiSetting({ apiKey: newApiKey });
    } else {
      settings.apiKey = newApiKey;
    }
    await settings.save();
    res.json({ newApiKey });
  } catch (error) {
    console.error("Error generating new API key:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
