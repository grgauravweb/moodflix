const express = require("express");
const router = express.Router();
const TransactionLog = require("../../model/Subscription/TransactionLog");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || "blr1",
  endpoint: process.env.DO_SPACES_URL || "https://blr1.digitaloceanspaces.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "DO002JVPT7YX78TP7G7C",
    secretAccessKey: process.env.DO_SPACES_SECRET || "FDdbM3P5Fq2b6A/uz8dYO7xs5f75umSMEcFzOt53g7o",
  },
});

// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFileToSpaces = async (file, folder) => {
  const bucketName = process.env.DO_SPACES_BUCKET;
  const cdnUrl = process.env.DO_SPACES_CDN_URL; // ✅ Use CDN URL

  if (!file) return null; // Return null if no file is uploaded

  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  return `${cdnUrl}/${fileName}`; // Return the uploaded file URL
};

// POST route for User submits payment proof
router.post("/",
    upload.single("screenshotUrl"),
  async (req, res) => {
  try {
    const { user, package, paymentMethod, amount, transactionId, transactionInfo } = req.body;

    const file = req.file; // Get the uploaded file from the request
    let screenshotUrlPath = null;
    if (file) {
      // Upload the file to DigitalOcean Spaces and get the URL
      screenshotUrlPath = await uploadFileToSpaces(file, "transactionProofs");
    }
    
    // Check if all required fields are provided
    const newLog = new TransactionLog({
      user,
      package,
      paymentMethod,
      amount,
      transactionId,
      screenshotUrl: screenshotUrlPath,
      transactionInfo,
      status: "Pending"
    });

    const savedLog = await newLog.save();

    res.status(201).json({
      message: "Transaction submitted. Waiting for admin approval.",
      savedLog
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route for fetching transaction logs
router.get("/", async (req, res) => {
  try {
    const logs = await TransactionLog.find().populate("user package").sort({ paymentTime: -1 })
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const transactions = await TransactionLog.find({ user: userId }).populate("package");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
