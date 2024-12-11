const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema({
  purchaseCode: { type: String, required: true },
  termsUrl: { type: String, required: true },
  navigationMenu: { type: String, enum: ['Grid', 'Vertical'], default: 'Grid' },
  tvProgramGuide: { type: Boolean, default: false },
  mandatoryLogin: { type: Boolean, default: false },
  displayGenreHome: { type: Boolean, default: false },
  countryGenreHome: { type: Boolean, default: false },
  siteName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  systemEmail: { type: String, required: true },
  contactEmail: { type: String, required: true },
  termsConditions: { type: String },
  videoFileOrder: { type: String, enum: ['Ascending', 'Descending'], default: 'Ascending' },
  seasonOrder: { type: String, enum: ['Ascending', 'Descending'], default: 'Descending' },
  episodeOrder: { type: String, enum: ['Ascending', 'Descending'], default: 'Descending' },
}, { timestamps: true });

const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);

module.exports = SystemSetting;
