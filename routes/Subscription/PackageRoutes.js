// routes/packageRoutes.js
const express = require('express');
const Package = require('../../model/Subscription/Package');

const router = express.Router();

// Route to create a new package
router.post('/', async (req, res) => {
  const { packageName, validity, price, status } = req.body;

  try {
    const newPackage = new Package({
      packageName,
      validity,
      price,
      status,
    });

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(500).json({ message: 'Failed to add package', error: error.message });
  }
});

// Route to fetch all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Failed to fetch packages', error: error.message });
  }
});


// Update an existing package
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { packageName, validity, price, status } = req.body;
  
    try {
      const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { packageName, validity, price, status },
        { new: true, runValidators: true }
      );
  
      if (!updatedPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
  
      res.json(updatedPackage);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update package', error });
    }
  });
  
  // Delete a package
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedPackage = await Package.findByIdAndDelete(id);
  
      if (!deletedPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
  
      res.json({ message: 'Package deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete package', error });
    }
  });

module.exports = router;
