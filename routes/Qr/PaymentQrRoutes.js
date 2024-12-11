const express = require('express');
const router = express.Router();
const PaymentQr = require('../../model/Qr/PaymentQrModel');

// Route to get all QR codes
router.get('/', async (req, res) => {
  try {
    const qrCodes = await PaymentQr.find();
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new QR code
router.post('/', async (req, res) => {
  const { name, image } = req.body;

  const newQrCode = new PaymentQr({
    name,
    image,
  });

  try {
    const savedQrCode = await newQrCode.save();
    res.status(201).json(savedQrCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Route to update a QR code by ID
router.put('/:id', async (req, res) => {
  const { name, image } = req.body;

  try {
    const updatedQrCode = await PaymentQr.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true }
    );

    if (!updatedQrCode) return res.status(404).json({ message: 'QR Code not found' });

    res.json(updatedQrCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a QR code by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedQrCode = await PaymentQr.findByIdAndDelete(req.params.id);
    if (!deletedQrCode) return res.status(404).json({ message: 'QR Code not found' });

    res.json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
