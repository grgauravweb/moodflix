const express = require('express');
const router = express.Router();
const TvChannel = require('../../model/AddTvChannel/AddTVChannelModel');

// Create a new TV channel
router.post('/', async (req, res) => {
  const {
    tvName,
    description,
    category,
    streamFrom,
    label,
    streamUrl,
    streamFromOptional1,
    labelOptional1,
    streamUrlOptional1,
    streamFromOptional2,
    labelOptional2,
    streamUrlOptional2,
    freePaid,
    thumbnail,
    poster,
    publish,
    featured,
  } = req.body;

  try {
    const newTvChannel = new TvChannel({
      tvName,
      description,
      category,
      streamFrom,
      label,
      streamUrl,
      streamFromOptional1,
      labelOptional1,
      streamUrlOptional1,
      streamFromOptional2,
      labelOptional2,
      streamUrlOptional2,
      freePaid,
      thumbnail,
      poster,
      publish,
      featured,
    });

    await newTvChannel.save();
    res.status(201).json({ message: 'TV Channel created successfully!', newTvChannel });
  } catch (error) {
    console.error('Error creating TV channel:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch all TV channels (optional)
router.get('/', async (req, res) => {
  try {
    const tvChannels = await TvChannel.find();
    res.status(200).json(tvChannels);
  } catch (error) {
    console.error('Error fetching TV channels:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Update a TV channel by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const {
    tvName,
    description,
    category,
    streamFrom,
    label,
    streamUrl,
    streamFromOptional1,
    labelOptional1,
    streamUrlOptional1,
    streamFromOptional2,
    labelOptional2,
    streamUrlOptional2,
    freePaid,
    thumbnail,
    poster,
    publish,
    featured,
  } = req.body;

  try {
    const updatedTvChannel = await TvChannel.findByIdAndUpdate(
      id,
      {
        tvName,
        description,
        category,
        streamFrom,
        label,
        streamUrl,
        streamFromOptional1,
        labelOptional1,
        streamUrlOptional1,
        streamFromOptional2,
        labelOptional2,
        streamUrlOptional2,
        freePaid,
        thumbnail,
        poster,
        publish,
        featured,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTvChannel) {
      return res.status(404).json({ message: 'TV Channel not found' });
    }

    res.status(200).json({ message: 'TV Channel updated successfully!', updatedTvChannel });
  } catch (error) {
    console.error('Error updating TV channel:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Delete a TV channel by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTvChannel = await TvChannel.findByIdAndDelete(id);

    if (!deletedTvChannel) {
      return res.status(404).json({ message: 'TV Channel not found' });
    }

    res.status(200).json({ message: 'TV Channel deleted successfully!' });
  } catch (error) {
    console.error('Error deleting TV channel:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
