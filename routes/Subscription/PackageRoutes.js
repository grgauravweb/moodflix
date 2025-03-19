// routes/packageRoutes.js
const express = require('express');
const Package = require('../../model/Subscription/Package');

const router = express.Router();

// Route to create a new package (ADMIN Only)
router.post('/', async (req, res) => {
  const { packageName, validity, price, description, status } = req.body;

  try {

    if (!packageName || !validity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPackage = new Package({
      packageName,
      validity,
      price,
      description,
      status: status || "Active",
    });

    await newPackage.save();
    res.status(201).json({ message: "Package created successfully", newPackage });
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(500).json({ message: 'Failed to add package', error: error.message });
  }
});

// Route to fetch all packages (ADMIN Only)
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Failed to fetch packages', error: error.message });
  }
});

// Route to fetch all packages (USER Only)
router.get('/active', async (req, res) => {
  try {
    const packages = await Package.find({ status: "Active" });
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Failed to fetch packages', error: error.message });
  }
});

// Route to fetch package by Id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await Package.findById(id)
    if (!packageData) return res.status(404).json({ message: "Package not found." })

    res.status(200).json(packageData)
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
})

// Update an existing package
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { packageName, validity, description, price, status } = req.body;

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { packageName, validity, price, status, description },
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
