const mongoose = require("mongoose");

const videoQualitySchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("VideoQuality", videoQualitySchema);
