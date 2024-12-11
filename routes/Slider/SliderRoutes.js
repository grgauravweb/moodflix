const express = require('express');
const router = express.Router();
const ImageSlider = require('../../model/Slider/SliderModel');



// Create a new image slider
router.post('/', async (req, res) => {
  try {
    const { title, description, sortOrder, actionType, actionButtonText, status, image } = req.body;

    // Check if the image is a valid base64 string
    if (!image || !image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image data' });
    }

    const newSlider = new ImageSlider({
      title,
      description,
      sortOrder,
      actionType,
      actionButtonText,
      status,
      image,
    });

    await newSlider.save();
    res.status(201).json(newSlider);
  } catch (error) {
    console.error('Error creating image slider:', error);
    res.status(500).json({ message: 'Failed to create image slider', error: error.message });
  }
});

// Get all image sliders
router.get('/', async (req, res) => {
  try {
    const sliders = await ImageSlider.find(); // Fetch all sliders from the database
    res.status(200).json(sliders); // Return the sliders as a JSON response
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ message: 'Failed to fetch sliders', error: error.message });
  }
});

// Update an existing image slider
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, sortOrder, actionType, actionButtonText, status, image } = req.body;

    // Check if the image is a valid base64 string if provided
    if (image && !image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image data' });
    }

    const updatedSlider = await ImageSlider.findByIdAndUpdate(
      id,
      { title, description, sortOrder, actionType, actionButtonText, status, image },
      { new: true } // Return the updated document
    );

    if (!updatedSlider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    res.status(200).json(updatedSlider); // Return the updated slider
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ message: 'Failed to update slider', error: error.message });
  }
});

// DELETE a slider by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the slider from the database
    const deletedSlider = await ImageSlider.findByIdAndDelete(id);

    if (!deletedSlider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    res.status(200).json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ message: 'Failed to delete slider' });
  }
});







module.exports = router;
