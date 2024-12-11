const mongoose = require('mongoose');

const ImageSliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sortOrder: {
    type: Number,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'Open WebView URL', // Existing action type
      'Another Action',    // New action type (add your own)
      'Some Other Action', // New action type (add your own)
      // You can add more action types as needed
    ],
  },
  actionButtonText: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive'],
  },
  image: {
    type: String, // For base64 image string
    required: true,
  },
}, { timestamps: true });

const ImageSlider = mongoose.model('ImageSlider', ImageSliderSchema);

module.exports = ImageSlider;
