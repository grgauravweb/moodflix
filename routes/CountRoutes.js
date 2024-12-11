// const express = require('express');
// const router = express.Router();
// const Movie = require('../model/AllMovies/AllMoviesModel'); // Adjust based on your actual model
// const TVSeries = require('../models/TVSeries');
// const LiveTV = require('../models/LiveTV');
// const Star = require('../models/Star');
// const Country = require('../models/Country');
// const Genre = require('../models/Genre');
// const User = require('../models/User');

// // Get total count of movies
// router.get('/movies/count', async (req, res) => {
//     try {
//         const count = await Movie.countDocuments();
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get popular movies
// router.get('/movies/popular', async (req, res) => {
//     try {
//         const popularMovies = await Movie.find({}).sort({ rating: -1 }).limit(10); // Adjust sorting logic as needed
//         res.json(popularMovies);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get top-rated movies
// router.get('/movies/top-rated', async (req, res) => {
//     try {
//         const topRatedMovies = await Movie.find({}).sort({ rating: -1 }).limit(10); // Adjust sorting logic as needed
//         res.json(topRatedMovies);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get total count of TV series
// router.get('/tvseries/count', async (req, res) => {
//     try {
//         const count = await TVSeries.countDocuments();
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get total count of live TV channels
// router.get('/live-tv/count', async (req, res) => {
//     try {
//         const count = await LiveTV.countDocuments();
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get total count of stars
// router.get('/stars/count', async (req, res) => {
//     try {
//         const count = await Star.countDocuments();
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get total count of countries
// router.get('/countries/count', async (req, res) => {
//     try {
//         const count = await Country.countDocuments();
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get total count of genres
// router.get('/genres/count', async (req, res) => {
//     try {
//         const count = await Genre.countDocuments();
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get recent subscribers
// router.get('/users/recent-subscribers', async (req, res) => {
//     try {
//         const recentSubscribers = await User.find({}).sort({ createdAt: -1 }).limit(10); // Adjust sorting logic as needed
//         res.json(recentSubscribers);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// module.exports = router;
