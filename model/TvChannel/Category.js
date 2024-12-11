// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  liveTvCategory: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
