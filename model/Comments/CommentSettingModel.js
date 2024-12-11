const mongoose = require("mongoose");

const commentSettingSchema = new mongoose.Schema({
  commentSetting: {
    type: String,
    required: true,
  },
  commentApproval: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("CommentSetting", commentSettingSchema);
