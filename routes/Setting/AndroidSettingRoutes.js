// routes/androidSettingRoutes.js
const express = require('express');
const AndroidSetting = require('../../model/Setting/AndroidSettingModel');

const router = express.Router();

// POST route to save Android settings
router.post('/', async (req, res) => {
  const {
    latestApkVersionName,
    latestApkVersionCode,
    apkFileUrl,
    whatsNew,
    updateSkippable,
  } = req.body;

  try {
    const newSetting = new AndroidSetting({
      latestApkVersionName,
      latestApkVersionCode,
      apkFileUrl,
      whatsNew,
      updateSkippable,
    });

    const savedSetting = await newSetting.save();
    res.status(201).json(savedSetting);
  } catch (error) {
    console.error('Error saving Android setting:', error);
    res.status(500).json({ message: 'Failed to save Android setting' });
  }
});

// GET route to fetch the latest Android setting
router.get('/', async (req, res) => {
  try {
    const setting = await AndroidSetting.findOne().sort({ createdAt: -1 }); // fetch latest
    res.status(200).json(setting);
  } catch (error) {
    console.error('Error fetching Android setting:', error);
    res.status(500).json({ message: 'Failed to fetch Android setting' });
  }
});

module.exports = router;
