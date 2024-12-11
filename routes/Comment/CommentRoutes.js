const express = require("express");
const Comment = require("../../model/Comments/CommentsModel");

const router = express.Router();

// Get all comments with optional filtering and pagination
router.get("/", async (req, res) => {
    try {
      const comments = await Comment.find();
      res.json(comments); // Ensure this returns an array
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Create a new comment
router.post("/", async (req, res) => {
  const { author, text, inResponseTo, status } = req.body;

  const newComment = new Comment({
    author,
    text,
    inResponseTo,
    status,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment" });
  }
});

// Update a comment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { author, text, inResponseTo, status } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { author, text, inResponseTo, status },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
});

// Delete a comment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
});

module.exports = router;
