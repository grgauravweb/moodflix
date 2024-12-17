const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require("./routes/TvChannel/Categories");
const programGuideRoutes = require("./routes/TvChannel/ProgramGuideRoutes");
const genreRoutes = require('./routes/Genre/genreroutes');
const imageSliderRoutes = require('./routes/Slider/SliderRoutes');
const sliderSettingRoutes = require('./routes/Slider/SliderSetting');
const starManagmentRoutes = require("./routes/Star/StarManagementRoute");
const UserManagemementModal = require("./routes/User/UserManagementRoutes");
const packageRoutes = require("./routes/Subscription/PackageRoutes");
const paymentSettingsRoutes = require("./routes/Subscription/PaymentSetting");
const SettingRoutes = require("./routes/Subscription/SettingRoutes");
const TransactionLog = require("./routes/Subscription/TransactionLog");
const NotificatonSettings = require("./routes/Notification/NotificationRoutes");
const LiveTVNotification = require("./routes/Notification/LiveTvRoutes");
const systemSettingsRoutes = require("./routes/Setting/SystemSettingRoutes");
const androidSettingRoutes = require("./routes/Setting/AndroidSettingRoutes");
const emailSettingsRouter = require("./routes/Setting/EmailSettingRouter");
const adsSettingsRoute = require("./routes/Setting/AdsSettingRoutes");
const TmdbSettingRoute = require("./routes/Setting/TmdbSettingRoutes");
const cronRoutes = require("./routes/Setting/CronSettingRoutes");
const ApiSetting = require("./routes/Setting/ApiSettingRoutes");
const videoQualitiesRoutes = require("./routes/Setting/VideoQualityRoutes");
const commentSettingRoutes = require("./routes/Comment/CommentSettingRoute");
const commentsRouter = require("./routes/Comment/CommentRoutes");
const movieRoutes = require("./routes/AllMovies/AllMoviesRoutes");
const tvSeriesRoutes = require("./routes/AllTvSeries/AllTvSeriesRoutes");
const countryRoutes = require("./routes/Country/CountryRoutes");
const popularMoviesRoutes = require("./routes/MainDashboard/popularMoviesRoutes");
const topRatedMoviesRoutes = require("./routes/MainDashboard/topRatedMoviesRoutes");
const subscribersRoutes = require("./routes/MainDashboard/subscribersRoutes");
const tvChannelsRoute = require("./routes/AddTvChannel/AddTvChannelRoutes");
const paymentQrRoutes = require("./routes/Qr/PaymentQrRoutes");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ====== Middleware ====== //

// Explicitly enable CORS for frontend origin
const corsOptions = {
  origin: '*', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies or credentials if needed
};

app.use(cors(corsOptions));

// Increase the payload limit for larger data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'uploads' folder
app.use(express.static('uploads'));

// ====== MongoDB Connection ====== //
mongoose.connect(
  process.env.MONGO_URI || 'mongodb+srv://vivekkumar787067:vivek@cluster0.5fgoc.mongodb.net/moodflix?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// ====== Routes ====== //
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ProgramGuide', programGuideRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/sliders', imageSliderRoutes);
app.use('/api/slider-settings', sliderSettingRoutes);
app.use('/api/stars', starManagmentRoutes);
app.use('/api/users', UserManagemementModal);
app.use('/api/packages', packageRoutes);
app.use("/api/payment-settings", paymentSettingsRoutes);
app.use("/api/settings", SettingRoutes);
app.use("/api/transactions", TransactionLog);
app.use("/api/push-notification-settings", NotificatonSettings);
app.use("/api/notifications/latest", LiveTVNotification);
app.use("/api/notifications", LiveTVNotification);
app.use("/api/system-settings", systemSettingsRoutes);
app.use('/api/android-settings', androidSettingRoutes);
app.use("/api/email-settings", emailSettingsRouter);
app.use("/api/ads-settings", adsSettingsRoute);
app.use("/api/tmdb-settings", TmdbSettingRoute);
app.use("/api/cron-settings", cronRoutes);
app.use("/api/api-settings", ApiSetting);
app.use("/api/videoQualities", videoQualitiesRoutes);
app.use("/api/commentSetting", commentSettingRoutes);
app.use("/api/comments", commentsRouter);
app.use('/api/movies', movieRoutes);
app.use('/api/tvseries', tvSeriesRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/popularMovies', popularMoviesRoutes);
app.use('/api/topRatedMovies', topRatedMoviesRoutes);
app.use('/api/subscribers', subscribersRoutes);
app.use('/api/tvChannels', tvChannelsRoute);
app.use('/api/payment-qr', paymentQrRoutes);

// ====== Server Start ====== //
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
