// models/PushNotificationSetting.js
const mongoose = require("mongoose");

const PushNotificationSettingSchema = new mongoose.Schema({
  oneSignalApiKey: {
    type: String,
    required: true,
  },
  oneSignalAppId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PushNotificationSetting", PushNotificationSettingSchema);
