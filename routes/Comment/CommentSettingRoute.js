const express = require("express");
const router = express.Router();
const CommentSetting = require("../../model/Comments/CommentSettingModel");

// Fetch comment settings
router.get("/", async (req, res) => {
  try {
    const settings = await CommentSetting.findOne({});
    res.json(settings || { commentSetting: "", commentApproval: false });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comment settings" });
  }
});

// Save comment settings
router.post("/", async (req, res) => {
  const { commentSetting, commentApproval } = req.body;

  try {
    let settings = await CommentSetting.findOne({});
    if (settings) {
      settings.commentSetting = commentSetting;
      settings.commentApproval = commentApproval;
    } else {
      settings = new CommentSetting({ commentSetting, commentApproval });
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to save comment settings" });
  }
});

module.exports = router;
