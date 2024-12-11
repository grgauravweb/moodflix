// routes/pushNotificationRoutes.js
const express = require("express");
const router = express.Router();
const PushNotificationSetting = require("../../model/Notification/NotificatonSettings");

// Route to get existing push notification settings
router.get("/", async (req, res) => {
  try {
    const settings = await PushNotificationSetting.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// Route to update or create push notification settings
router.post("/", async (req, res) => {
  const { oneSignalApiKey, oneSignalAppId } = req.body;

  try {
    let settings = await PushNotificationSetting.findOne();

    if (settings) {
      // Update existing settings
      settings.oneSignalApiKey = oneSignalApiKey;
      settings.oneSignalAppId = oneSignalAppId;
    } else {
      // Create new settings
      settings = new PushNotificationSetting({ oneSignalApiKey, oneSignalAppId });
    }

    await settings.save();
    res.status(200).json({ message: "Settings saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save settings" });
  }
});

module.exports = router;
