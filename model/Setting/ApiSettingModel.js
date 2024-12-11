// models/ApiSetting.js
const mongoose = require("mongoose");

const apiSettingSchema = new mongoose.Schema({
  apiServerUrl: {
    type: String,
    required: true,
    default: "https://admin.hookflix.com/rest-api/",
  },
  apiKey: {
    type: String,
    required: true,
    default: "your-default-api-key",
  },
});

module.exports = mongoose.model("ApiSetting", apiSettingSchema);
