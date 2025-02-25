const express = require('express');
const Movie = require('../../model/AllMovies/AllMoviesModel');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { default: mongoose } = require('mongoose');
const router = express.Router();

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

// Create a new movie API to upload movie + video + thumbnail + poster
router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {

      const { title, description, releaseDate, tmdbId, slug, actors, directors, writers, imdbRating, countries, genres, runtime, freePaid, trailerUrl, videoQuality, sendNewsletter, sendPushNotification, publish, enableDownload } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }

      const genresData = genres ? genres.split(",").map((id) => id.trim()) : [];
      const actorsData = actors ? actors.split(",").map((id) => id.trim()) : [];
      const directorsData = directors ? directors.split(",").map((id) => id.trim()) : [];
      const writersData = writers ? writers.split(",").map((id) => id.trim()) : [];


      // Upload files to DigitalOcean
      const videoUrl = await uploadFileToSpaces(req.files.video?.[0], "movies/videos");
      const thumbnailUrl = await uploadFileToSpaces(req.files.thumbnail?.[0], "movies/thumbnails");
      const posterUrl = await uploadFileToSpaces(req.files.poster?.[0], "movies/posters");
      const checkMovie = await Movie.findOne({ title: title });
      if (checkMovie) {
        return res.status(400).json({ error: "Movie already exists with title" });
      }
      // Create movie entry in DB
      const movie = new Movie({
        title,
        slug,
        description,
        releaseDate,
        tmdbId: tmdbId || null,
        movieUrl: videoUrl,
        thumbnail: thumbnailUrl,
        poster: posterUrl,
        actors: actorsData,
        directors: directorsData,
        writers: writersData,
        imdbRating,
        countries,
        genres: genresData,
        runtime,
        freePaid,
        trailerUrl,
        videoQuality,
        sendNewsletter,
        sendPushNotification,
        publish,
        enableDownload,
      });

      await movie.save();
      res.status(201).json({ success: true, movie });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload movie" });
    }
  }
);

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
router.put('/:id',
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      const {
        title, description, releaseDate, tmdbId, slug,
        actors, directors, writers, imdbRating, countries,
        genres, runtime, freePaid, trailerUrl, videoQuality,
        sendNewsletter, sendPushNotification, publish, enableDownload
      } = req.body;

      // Convert comma-separated strings to arrays
      const genresData = genres ? genres.split(",").map(id => id.trim()) : movie.genres;
      const actorsData = actors ? actors.split(",").map(id => id.trim()) : movie.actors;
      const directorsData = directors ? directors.split(",").map(id => id.trim()) : movie.directors;
      const writersData = writers ? writers.split(",").map(id => id.trim()) : movie.writers;

      // Upload new files if provided
      const thumbnailUrl = req.files.thumbnail ? await uploadFileToSpaces(req.files.thumbnail[0], "movies/thumbnails") : movie.thumbnail;
      const posterUrl = req.files.poster ? await uploadFileToSpaces(req.files.poster[0], "movies/posters") : movie.poster;

      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
        title,
        slug,
        description,
        releaseDate,
        tmdbId: tmdbId || null,
        thumbnail: thumbnailUrl,
        poster: posterUrl,
        actors: actorsData,
        directors: directorsData,
        writers: writersData,
        imdbRating,
        countries,
        genres: genresData,
        runtime,
        freePaid,
        trailerUrl,
        videoQuality,
        sendNewsletter,
        sendPushNotification,
        publish,
        enableDownload,
      }, { new: true });

      res.status(200).json({ success: true, movie: updatedMovie });
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


module.exports = router;
