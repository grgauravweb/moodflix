// routes/emailSettings.js
const express = require("express");
const router = express.Router();
const EmailSetting = require("../../model/Setting/EmailSettingModel");


// Fetch email settings
router.get("/", async (req, res) => {
  try {
    let settings = await EmailSetting.findOne();
    if (!settings) {
      // If no settings exist, create default settings
      settings = await EmailSetting.create({
        contactEmail: "contact@mydomain.com",
      });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching email settings:", error);
    res.status(500).json({ message: "Server error fetching email settings" });
  }
});

// Update email settings
router.post("/", async (req, res) => {
    const {
      contactEmail,
      mailType,
      outgoingEmail,
      smtpServerAddress,
      smtpUsername,
      smtpPassword,
      smtpPort,
      smtpCrypto,
    } = req.body;
  
    try {
      let settings = await EmailSetting.findOne();
  
      if (!settings) {
        settings = new EmailSetting({
          contactEmail,
          mailType,
          outgoingEmail,
          smtpServerAddress,
          smtpUsername,
          smtpPassword,
          smtpPort,
          smtpCrypto,
        });
      } else {
        settings.contactEmail = contactEmail || settings.contactEmail;
        settings.mailType = mailType || settings.mailType;
        settings.outgoingEmail = outgoingEmail || settings.outgoingEmail;
        settings.smtpServerAddress = smtpServerAddress || settings.smtpServerAddress;
        settings.smtpUsername = smtpUsername || settings.smtpUsername;
        settings.smtpPassword = smtpPassword || settings.smtpPassword;
        settings.smtpPort = smtpPort || settings.smtpPort;
        settings.smtpCrypto = smtpCrypto || settings.smtpCrypto;
      }
  
      await settings.save();
      res.json({ message: "Settings saved successfully", settings });
    } catch (error) {
      console.error("Error saving email settings:", error);
      res.status(500).json({ message: "Server error saving email settings" });
    }
  });

module.exports = router;
