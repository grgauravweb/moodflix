const express = require('express');
const router = express.Router();
const Genre = require('../../model/Genre/GenreModel');

// Create a new genre
router.post('/', async (req, res) => {
  try {
    const { name, description, slug, featured, status, icon } = req.body;

    // Check if the icon is a valid base64 string
    if (!icon || !icon.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid icon data' });
    }

    const newGenre = new Genre({
      name,
      description,
      slug,
      featured,
      status,
      icon, // Base64 image string
    });

    await newGenre.save();
    res.status(201).json(newGenre);
  } catch (error) {
    console.error('Error creating genre:', error);
    res.status(500).json({ message: 'Failed to create genre', error: error.message });
  }
});


// Get all genres
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find(); // Fetch all genres from the database
    res.status(200).json(genres); // Return the genres as a JSON response
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Failed to fetch genres', error: error.message });
  }
});




// Update an existing genre
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, slug, featured, status, icon } = req.body;

    // Check if the icon is a valid base64 string if provided
    if (icon && !icon.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid icon data' });
    }

    const updatedGenre = await Genre.findByIdAndUpdate(
      id,
      { name, description, slug, featured, status, icon },
      { new: true } // Return the updated document
    );

    if (!updatedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.status(200).json(updatedGenre); // Return the updated genre
  } catch (error) {
    console.error('Error updating genre:', error);
    res.status(500).json({ message: 'Failed to update genre', error: error.message });
  }
});


// DELETE a genre by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the genre from the database
    const deletedGenre = await Genre.findByIdAndDelete(id);

    if (!deletedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({ message: 'Failed to delete genre' });
  }
});


module.exports = router;
