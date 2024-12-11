const express = require('express');
const router = express.Router();
const Country = require('../../model/Country/CountryModel');

// Create a new country
router.post('/', async (req, res) => {
  const { name, icon, slug, description, status } = req.body;

  // Validate the data
  if (!name || !icon || !slug || !description) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new country
    const newCountry = new Country({ name, icon, slug, description, status });
    await newCountry.save();
    res.status(201).json(newCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an existing country
router.put('/:id', async (req, res) => {
  const { name, slug, description, status, icon } = req.body; // Ensure it matches what is sent from the frontend
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      { name, slug, description, status, icon },
      { new: true } // Returns the updated document
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.status(200).json(updatedCountry);
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete a country
router.delete('/:id', async (req, res) => {
    try {
      const deletedCountry = await Country.findByIdAndDelete(req.params.id);
  
      if (!deletedCountry) {
        return res.status(404).json({ message: 'Country not found' });
      }
  
      res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
      console.error('Error deleting country:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
