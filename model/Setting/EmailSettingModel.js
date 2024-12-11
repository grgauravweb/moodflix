const mongoose = require("mongoose"); // Add this line to import Mongoose

const EmailSettingSchema = new mongoose.Schema({
  contactEmail: {
    type: String,
    required: true,
    default: "contact@mydomain.com",
  },
  mailType: {
    type: String,
    default: "Mail",
  },
  outgoingEmail: {
    type: String,
    default: "",
  },
  smtpServerAddress: {
    type: String,
    default: "",
  },
  smtpUsername: {
    type: String,
    default: "",
  },
  smtpPassword: {
    type: String,
    default: "",
  },
  smtpPort: {
    type: Number,
    default: 465,
  },
  smtpCrypto: {
    type: String,
    enum: ["ssl", "tls"],
    default: "ssl",
  },
});

// Create a model from the schema
const EmailSetting = mongoose.model("EmailSetting", EmailSettingSchema);

// Export the model
module.exports = EmailSetting;
