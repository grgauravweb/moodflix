const express = require('express');
const TvSeries = require('../../model/AllTvSeries/AllTvSeriesModel'); // Adjust the path to your TV Series model
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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

// OLD Create a new movie
// router.post('/', async (req, res) => {
//   try {
//     const TVSeriesData = { ...req.body };
//     if (!TVSeriesData.tmdbId) delete TVSeriesData.tmdbId; // Remove tmdbId if it's empty

//     const movie = new TvSeries(TVSeriesData);
//     await movie.save();
//     res.status(201).json(movie);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Create a new movie
router.post(
  "/",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "episodes", maxCount: 50 },
    { name: "episodesThumbnails", maxCount: 50 }
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        releaseDate,
        tmdbId,
        slug,
        actors,
        directors,
        writers,
        imdbRating,
        countries,
        genres,
        seasons,
        runtime,
        freePaid,
        trailerUrl,
        videoQuality,
        sendNewsletter,
        sendPushNotification,
        publish,
        enableDownload,
        episodesMetadata
      } = req.body;
      console.log("REQ: ", req.body)
      console.log("Received episodes:", req.body.episodes);
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      const parsedEpisodes = JSON.parse(episodesMetadata);
      console.log("Parsed Episodes: ", parsedEpisodes);
      console.log("Parsed Episodes Count: ", parsedEpisodes.length);
      // Split string values into arrays
      const genresData = genres ? genres.split(",").map((id) => id.trim()) : [];
      const actorsData = actors ? actors.split(",").map((id) => id.trim()) : [];
      const directorsData = directors ? directors.split(",").map((id) => id.trim()) : [];
      const writersData = writers ? writers.split(",").map((id) => id.trim()) : [];

      // Upload poster and thumbnail to DigitalOcean Spaces
      const posterUrl = await uploadFileToSpaces(req.files.poster?.[0], "series/posters");
      const thumbnailUrl = await uploadFileToSpaces(req.files.thumbnail?.[0], "series/thumbnails");

      // 🆕 Handle Episodes Upload
      let episodesData = [];
      for (let i = 0; i < parsedEpisodes.length; i++) {
        const episode = parsedEpisodes[i];
        console.log("Processing Episode: ", episode);
        const videoFile = Array.isArray(req.files.episodes) ? req.files.episodes[i] : req.files.episodes;
        const thumbnailFile = Array.isArray(req.files.episodesThumbnails) ? req.files.episodesThumbnails[i] : req.files.episodesThumbnails;

        if (!videoFile || !thumbnailFile) {
          console.error(`Missing files for episode ${i + 1}`);
          continue;  // Skip if files are missing
        }

        const videoUrl = await uploadFileToSpaces(videoFile, "series/videos");
        const episodeThumbnailUrl = await uploadFileToSpaces(thumbnailFile, "series/episode-thumbnails");

        episodesData.push({
          ...episode,
          seasonNumber: episode.seasonNumber || seasons,
          video: videoUrl,
          thumbnail: episodeThumbnailUrl
        });
      }
      console.log("Final Episodes Data: ", episodesData);

      // Check if series already exists
      // let tvSeries = await TvSeries.findOne({ title });
      // if (tvSeries) {
      //   // Update series with new episodes
      //   tvSeries.episodes = [...tvSeries.episodes, ...episodesData];
      //   await tvSeries.save();
      // } else {
      // Create new series
      const tvSeries = new TvSeries({
        title,
        slug,
        description,
        releaseDate,
        tmdbId,
        seasonNumber: Number(seasons),
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
        episodes: episodesData,
        sendNewsletter,
        sendPushNotification,
        publish,
        enableDownload,
      });
      await tvSeries.save();


      res.status(201).json({ success: true, tvSeries });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload TV series" });
    }
  }
);

router.post(
  "/add",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        releaseDate,
        tmdbId,
        slug,
        actors,
        directors,
        writers,
        imdbRating,
        countries,
        genres,
        seasons,
        runtime,
        freePaid,
        trailerUrl,
        videoQuality,
        sendNewsletter,
        sendPushNotification,
        publish,
        enableDownload,
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      // Split string values into arrays
      const genresData = genres ? genres.split(",").map((id) => id.trim()) : [];
      const actorsData = actors ? actors.split(",").map((id) => id.trim()) : [];
      const directorsData = directors ? directors.split(",").map((id) => id.trim()) : [];
      const writersData = writers ? writers.split(",").map((id) => id.trim()) : [];

      // Upload poster and thumbnail to DigitalOcean Spaces
      const posterUrl = await uploadFileToSpaces(req.files.poster[0], "series/posters");
      const thumbnailUrl = await uploadFileToSpaces(req.files.thumbnail[0], "series/thumbnails");

      // 🆕 Handle Episodes Upload

      // Check if series already exists
      const checktvSeries = await TvSeries.findOne({ title });
      if (checktvSeries) {
        // Update series with new episodes
        res.status(200).json({ message: "TV Series already exits with title" })
      }

      // Create new series
      const tvSeries = new TvSeries({
        title,
        slug,
        description,
        releaseDate,
        tmdbId,
        seasonNumber: Number(seasons),
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
      await tvSeries.save();

      res.status(201).json({ success: true, tvSeries });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload TV series" });
    }
  }
);

router.post(
  "/:seriesId/add-episode",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { seriesId } = req.params;

      const {
        title,
        episodeNumber,
        seasonNumber,
        description,
        releaseDate,
        freePaid,
        videoQuality,
      } = req.body;

      if (!title || !episodeNumber || !seasonNumber) {
        return res.status(400).json({ error: "Title, episodeNumber, and seasonNumber are required" });
      }
      // Find the TV series
      const tvSeries = await TvSeries.findById(seriesId);
      if (!tvSeries) {
        return res.status(404).json({ error: "TV Series not found" });
      }

      // Upload poster and thumbnail to DigitalOcean Spaces
      const videoUrl = await uploadFileToSpaces(req.files.video[0], "series/videos");
      const thumbnailUrl = await uploadFileToSpaces(req.files.thumbnail[0], "series/thumbnails");


      const newEpisode = {
        title,
        episodeNumber,
        seasonNumber,
        description,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        releaseDate,
        freePaid,
        videoQuality,
      };

      tvSeries.episodes.push(newEpisode);
      await tvSeries.save();

      res.status(201).json({  success: true, message: "Episode added successfully", newEpisode });
    } catch (error) {
      console.error("Error adding episode:", error);
      res.status(500).json({ error: "Failed to add episode" });
    }
  }
);

// Get all TV Series
router.get('/', async (req, res) => {
  try {
    const tvSeriesList = await TvSeries.find();
    res.status(200).json(tvSeriesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a TV Series by ID
router.get('/:id', async (req, res) => {
  try {
    const tvSeries = await TvSeries.findById(req.params.id);
    if (!tvSeries) {
      return res.status(404).json({ message: 'TV Series not found' });
    }
    res.status(200).json(tvSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a TV Series
router.put('/:id', async (req, res) => {
  try {
    const tvSeries = await TvSeries.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tvSeries) {
      return res.status(404).json({ message: 'TV Series not found' });
    }
    res.status(200).json(tvSeries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a TV Series
router.delete('/:id', async (req, res) => {
  try {
    const tvSeries = await TvSeries.findByIdAndDelete(req.params.id);
    if (!tvSeries) {
      return res.status(404).json({ message: 'TV Series not found' });
    }
    res.status(200).json({ message: 'TV Series deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
