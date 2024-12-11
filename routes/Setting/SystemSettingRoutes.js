const express = require("express");
const SystemSetting = require("../../model/Setting/SystemSettingModel");
const router = express.Router();

// GET - Fetch the latest system settings
router.get("/latest", async (req, res) => {
    try {
      const settings = await SystemSetting.findOne().sort({ createdAt: -1 });
      
      // Return default settings if none exist
      if (!settings) {
        return res.status(200).json({
          purchaseCode: '',
          termsUrl: '',
          navigationMenu: 'Grid',
          tvProgramGuide: false,
          mandatoryLogin: false,
          displayGenreHome: false,
          countryGenreHome: false,
          siteName: '',
          address: '',
          phone: '',
          systemEmail: '',
          contactEmail: '',
          termsConditions: '',
          videoFileOrder: 'Ascending',
          seasonOrder: 'Ascending',
          episodeOrder: 'Ascending',
        });
      }
  
      return res.status(200).json(settings);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  

// GET - Fetch the latest system settings
router.get("/Settinglatest", async (req, res) => {
  try {
    const settings = await SystemSetting.findOne().sort({ createdAt: -1 });
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
    const {
      purchaseCode,
      termsUrl,
      navigationMenu,
      tvProgramGuide,
      mandatoryLogin,
      displayGenreHome,
      countryGenreHome,
      siteName,
      address,
      phone,
      systemEmail,
      contactEmail,
      termsConditions,
      videoFileOrder,
      seasonOrder,
      episodeOrder,
    } = req.body;
  
    try {
      // Create a new instance of SystemSetting
      const newSystemSetting = new SystemSetting({
        purchaseCode,
        termsUrl,
        navigationMenu,
        tvProgramGuide,
        mandatoryLogin,
        displayGenreHome,
        countryGenreHome,
        siteName,
        address,
        phone,
        systemEmail,
        contactEmail,
        termsConditions,
        videoFileOrder,
        seasonOrder,
        episodeOrder,
      });
  
      // Save the new system setting to the database
      const savedSetting = await newSystemSetting.save();
      
      // Respond with the saved data
      res.status(201).json(savedSetting);
    } catch (error) {
      console.error('Error saving system setting:', error);
      res.status(500).json({ message: 'Failed to save system setting' });
    }
  });

module.exports = router;
