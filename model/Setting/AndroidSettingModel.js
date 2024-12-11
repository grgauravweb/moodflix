// models/AndroidSetting.js
const mongoose = require('mongoose');

const androidSettingSchema = new mongoose.Schema({
  latestApkVersionName: {
    type: String,
    required: true,
  },
  latestApkVersionCode: {
    type: Number,
    required: true,
  },
  apkFileUrl: {
    type: String,
    required: true,
  },
  whatsNew: {
    type: [String], // An array of strings for multiple update notes
    required: true,
  },
  updateSkippable: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('AndroidSetting', androidSettingSchema);
