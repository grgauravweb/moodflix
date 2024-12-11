const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["Live TV", "Movie/TV-Series"], required: true },
  tvChannel: { type: String, required: false },
  headings: { type: String, required: true },
  message: { type: String, required: true },
  iconUrl: { type: String, required: false },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
