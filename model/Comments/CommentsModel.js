const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  inResponseTo: {
    type: String,
    required: true,
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Approved", "Unapproved", "Trash", "Spam"],
    default: "Unapproved",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
