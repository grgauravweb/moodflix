// routes/programGuideRoutes.js
const express = require('express');
const ProgramGuide = require('../../model/TvChannel/ProgramGuide');

const router = express.Router();

// Get all program guides with optional filters
router.get('/', async (req, res) => {
  try {
    const { channel, type, date } = req.query;
    const filters = {};

    if (channel) filters.tvChannel = channel;
    if (type) filters.type = type;
    if (date) filters.date = new Date(date);

    const programGuides = await ProgramGuide.find(filters);
    res.json(programGuides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new program guide
router.post('/', async (req, res) => {
  const { tvChannel, programTitle, date, time, type, status } = req.body;

  const programGuide = new ProgramGuide({
    tvChannel,
    programTitle,
    date,
    time,
    type,
    status,
  });

  try {
    const savedProgramGuide = await programGuide.save();
    res.status(201).json(savedProgramGuide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete a program guide
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use ProgramGuide model instead of Program
    const deletedProgramGuide = await ProgramGuide.findByIdAndDelete(id);
    
    if (!deletedProgramGuide) {
      return res.status(404).json({ error: 'Program guide not found' });
    }

    res.status(200).json({ message: 'Program guide deleted successfully' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete program guide' });
  }
});

// Update a program guide
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use ProgramGuide model instead of Program
    const updatedProgramGuide = await ProgramGuide.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProgramGuide) {
      return res.status(404).json({ error: 'Program guide not found' });
    }

    res.status(200).json(updatedProgramGuide);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to update program guide' });
  }
});

module.exports = router;
