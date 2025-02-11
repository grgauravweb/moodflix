const express = require('express');
const Movie = require('../../model/AllMovies/AllMoviesModel');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { default: mongoose } = require('mongoose');
const router = express.Router();

// Create a new movie
router.post('/', async (req, res) => {
  try {
    const movieData = { ...req.body };

    if (!movieData.tmdbId) delete movieData.tmdbId; // Remove tmdbId if it's empty

    const movie = new Movie(movieData);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.log("Error: ", error.message)
    res.status(400).json({ message: error.message });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a movie
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/count', async (req, res) => {
  console.log(req.params); // Log request parameters
  try {
    // Count the number of documents where _id exists
    const count = await Movie.countDocuments({ _id: { $exists: true } });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie count', error });
  }
});

// FIlter Moovies by GenreID
router.get("/by-genre/:genreId", async (req, res) => {
  try {
    const { genreId } = req.params;

    // Check if the genreId is valid
    if (!mongoose.Types.ObjectId.isValid(genreId)) {
      return res.status(400).json({ message: "Invalid Genre ID" });
    }

    // Find movies where the genres array contains the given genreId
    const movies = await Movie.find({ genres: genreId }).populate("genres");

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found for this genre" });
    }

    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
});

const s3 = new S3Client({
  region: "blr1", // Example: "nyc3"
  endpoint: "https://blr1.digitaloceanspaces.com", // Example: "https://nyc3.digitaloceanspaces.com"
  forcePathStyle: false,
  credentials: {
    accessKeyId: "DO002JVPT7YX78TP7G7C",
    secretAccessKey: "FDdbM3P5Fq2b6A/uz8dYO7xs5f75umSMEcFzOt53g7o",
  },
});

// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const bucketName = process.env.DO_SPACES_BUCKET;

    if (!bucketName) {
      return res.status(500).json({ error: "Bucket name is missing in .env" });
    }

    console.log("Uploading to Bucket:", bucketName);

    const params = {
      Bucket: bucketName, // ✅ Ensure this is set correctly
      Key: `videos/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    res.json({
      success: true,
      message: "Video uploaded successfully",
      url: `${process.env.DO_SPACES_ENDPOINT}/${bucketName}/videos/${file.originalname}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});


module.exports = router;
