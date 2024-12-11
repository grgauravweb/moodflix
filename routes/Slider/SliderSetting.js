const express = require('express');
const router = express.Router();
const SliderSetting = require('../../model/Slider/SliderSetting'); // Adjust path as needed

// Get the current slider settings
router.get('/', async (req, res) => {
  try {
    const setting = await SliderSetting.findOne(); // Retrieve the first setting
    res.status(200).json(setting);
  } catch (error) {
    console.error('Error fetching slider settings:', error);
    res.status(500).json({ message: 'Failed to fetch slider settings' });
  }
});

// Save or update slider settings
router.post('/', async (req, res) => {
  const { sliderType, totalContent } = req.body;

  try {
    // Check if a setting already exists
    let setting = await SliderSetting.findOne();

    if (setting) {
      // Update the existing setting
      setting.sliderType = sliderType;
      setting.totalContent = totalContent;
      await setting.save();
    } else {
      // Create a new setting
      setting = new SliderSetting({ sliderType, totalContent });
      await setting.save();
    }

    res.status(200).json({ message: 'Slider settings saved successfully', setting });
  } catch (error) {
    console.error('Error saving slider settings:', error);
    res.status(500).json({ message: 'Failed to save slider settings' });
  }
});

module.exports = router;
