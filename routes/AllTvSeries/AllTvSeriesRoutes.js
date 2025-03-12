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

// Create a Tv Series
router.post(
  "/",
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

// ✅ Add episodes for a specific TV series
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
        duration
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
        duration
      };

      tvSeries.episodes.push(newEpisode);
      await tvSeries.save();

      res.status(201).json({ success: true, message: "Episode added successfully", newEpisode });
    } catch (error) {
      console.error("Error adding episode:", error);
      res.status(500).json({ error: "Failed to add episode" });
    }
  }
);

// ✅ GET all episodes for a specific TV series
router.get("/:seriesId/episodes", async (req, res) => {
  try {
    const { seriesId } = req.params;
    const { season, freePaid, page = 1, limit = 10 } = req.query;

    // 🔍 Find the TV Series
    const series = await TvSeries.findById(seriesId);

    if (!series) {
      return res.status(404).json({ success: false, message: "TV series not found" });
    }

    // 🔎 Filter episodes based on query params
    let episodes = series.episodes;

    if (season) {
      episodes = episodes.filter(ep => ep.seasonNumber === Number(season));
    }

    if (freePaid) {
      episodes = episodes.filter(ep => ep.freePaid === freePaid);
    }

    // ⏳ Pagination
    const startIndex = (page - 1) * limit;
    const paginatedEpisodes = episodes.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      totalEpisodes: episodes.length,
      page: Number(page),
      limit: Number(limit),
      episodes: paginatedEpisodes,
    });

  } catch (error) {
    console.error("Error fetching episodes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

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
router.put('/:id',
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const tvSeries = await TvSeries.findById(id);
      if (!tvSeries) {
        return res.status(404).json({ error: "TV Series not found" });
      }
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

      // Split string values into arrays if provided
      const genresData = genres ? genres.split(",").map((id) => id.trim()) : tvSeries.genres;
      const actorsData = actors ? actors.split(",").map((id) => id.trim()) : tvSeries.actors;
      const directorsData = directors ? directors.split(",").map((id) => id.trim()) : tvSeries.directors;
      const writersData = writers ? writers.split(",").map((id) => id.trim()) : tvSeries.writers;

      // Upload new poster and thumbnail if provided
      let posterUrl = tvSeries.poster;
      let thumbnailUrl = tvSeries.thumbnail;

      if (req.files.poster) {
        posterUrl = await uploadFileToSpaces(req.files.poster[0], "series/posters");
      }
      if (req.files.thumbnail) {
        thumbnailUrl = await uploadFileToSpaces(req.files.thumbnail[0], "series/thumbnails");
      }

      // Update series fields
      tvSeries.title = title || tvSeries.title;
      tvSeries.slug = slug || tvSeries.slug;
      tvSeries.description = description || tvSeries.description;
      tvSeries.releaseDate = releaseDate || tvSeries.releaseDate;
      tvSeries.tmdbId = tmdbId || tvSeries.tmdbId;
      tvSeries.seasonNumber = seasons ? Number(seasons) : tvSeries.seasonNumber;
      tvSeries.thumbnail = thumbnailUrl;
      tvSeries.poster = posterUrl;
      tvSeries.actors = actorsData;
      tvSeries.directors = directorsData;
      tvSeries.writers = writersData;
      tvSeries.imdbRating = imdbRating || tvSeries.imdbRating;
      tvSeries.countries = countries || tvSeries.countries;
      tvSeries.genres = genresData;
      tvSeries.runtime = runtime || tvSeries.runtime;
      tvSeries.freePaid = freePaid || tvSeries.freePaid;
      tvSeries.trailerUrl = trailerUrl || tvSeries.trailerUrl;
      tvSeries.videoQuality = videoQuality || tvSeries.videoQuality;
      tvSeries.sendNewsletter = sendNewsletter || tvSeries.sendNewsletter;
      tvSeries.sendPushNotification = sendPushNotification || tvSeries.sendPushNotification;
      tvSeries.publish = publish || tvSeries.publish;
      tvSeries.enableDownload = enableDownload || tvSeries.enableDownload;

      await tvSeries.save();

      res.status(200).json({ success: true, tvSeries });
    } catch (error) {
      console.error("Update Error: ", error)
      res.status(400).json({ message: error.message });
    }
});

// Update Tv Series API
router.put(
  "/:seriesId/update-episode/:episodeId",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { seriesId, episodeId } = req.params;
      const {
        title,
        episodeNumber,
        seasonNumber,
        description,
        releaseDate,
        freePaid,
        videoQuality,
        duration,
      } = req.body;

      // Find the TV series
      const tvSeries = await TvSeries.findById(seriesId);
      if (!tvSeries) {
        return res.status(404).json({ error: "TV Series not found" });
      }

      // Find the episode
      const episode = tvSeries.episodes.id(episodeId);
      if (!episode) {
        return res.status(404).json({ error: "Episode not found" });
      }

      // Upload new video/thumbnail if provided
      if (req.files.video) {
        episode.video = await uploadFileToSpaces(req.files.video[0], "series/videos");
      }

      if (req.files.thumbnail) {
        episode.thumbnail = await uploadFileToSpaces(req.files.thumbnail[0], "series/thumbnails");
      }

      // Update other fields
      if (title) episode.title = title;
      if (episodeNumber) episode.episodeNumber = episodeNumber;
      if (seasonNumber) episode.seasonNumber = seasonNumber;
      if (description) episode.description = description;
      if (releaseDate) episode.releaseDate = releaseDate;
      if (freePaid) episode.freePaid = freePaid;
      if (videoQuality) episode.videoQuality = videoQuality;
      if (duration) episode.duration = duration;

      await tvSeries.save();

      res.status(200).json({ success: true, message: "Episode updated successfully", episode });
    } catch (error) {
      console.error("Error updating episode:", error);
      res.status(500).json({ error: "Failed to update episode" });
    }
  }
);

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
