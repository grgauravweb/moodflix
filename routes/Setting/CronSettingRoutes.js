const express = require("express");
const router = express.Router();
const CronSetting = require("../../model/Setting/CronSettingModel");

// Get Cron settings
router.get("/", async (req, res) => {
  try {
    const settings = await CronSetting.findOne(); // Assuming one settings document
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
});

// Post Cron settings
router.post("/", async (req, res) => {
  const {
    imageImportCron,
    emailNewsletterCron,
    dailyCron,
    weeklyCron,
    monthlyCron,
    cronKey,
    backupSchedule,
  } = req.body;

  try {
    const existingSettings = await CronSetting.findOne();

    if (existingSettings) {
      // Update existing settings
      existingSettings.imageImportCron = imageImportCron;
      existingSettings.emailNewsletterCron = emailNewsletterCron;
      existingSettings.dailyCron = dailyCron;
      existingSettings.weeklyCron = weeklyCron;
      existingSettings.monthlyCron = monthlyCron;
      existingSettings.cronKey = cronKey;
      existingSettings.backupSchedule = backupSchedule;

      await existingSettings.save();
      return res.status(200).json({ message: "Settings updated successfully" });
    }

    // Create new settings
    const newSettings = new CronSetting({
      imageImportCron,
      emailNewsletterCron,
      dailyCron,
      weeklyCron,
      monthlyCron,
      cronKey,
      backupSchedule,
    });

    await newSettings.save();
    res.status(201).json({ message: "Settings created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving settings", error });
  }
});

module.exports = router;
