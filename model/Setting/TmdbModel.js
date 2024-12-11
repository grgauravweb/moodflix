const mongoose = require("mongoose");

const TmdbSettingSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
  },
  defaultLanguage: {
    type: String,
    required: true,
  },
  imageGrabBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TmdbSetting", TmdbSettingSchema);
