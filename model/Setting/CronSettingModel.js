const mongoose = require("mongoose");

const CronSettingSchema = new mongoose.Schema({
  imageImportCron: {
    type: String,
    required: true,
  },
  emailNewsletterCron: {
    type: String,
    required: true,
  },
  dailyCron: {
    type: String,
    required: true,
  },
  weeklyCron: {
    type: String,
    required: true,
  },
  monthlyCron: {
    type: String,
    required: true,
  },
  cronKey: {
    type: String,
    required: true,
  },
  backupSchedule: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly"],
    default: "Daily",
  },
});

const CronSetting = mongoose.model("CronSetting", CronSettingSchema);

module.exports = CronSetting;
