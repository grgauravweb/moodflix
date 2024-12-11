const mongoose = require("mongoose");

const AdsSettingSchema = new mongoose.Schema({
  rewardAdsType: {
    type: String,
    default: "Disable",
  },
  rewardAdsId: {
    type: String,
    default: "xxxxxxxxxx",
  },
  bannerAdsType: {
    type: String,
    default: "Disable",
  },
  bannerAdsId: {
    type: String,
    default: "xxxxxxxxxx",
  },
  interstitialAdsType: {
    type: String,
    default: "Disable",
  },
  interstitialAdsId: {
    type: String,
    default: "xxxxxxxxxx",
  },
  nativeAdsType: {
    type: String,
    default: "Disable",
  },
  nativeAdsId: {
    type: String,
    default: "xxxxxxxxxx",
  },
  admobPublisherId: {
    type: String,
    default: "pub-xxxxxxxxxxxxxx",
  },
  unityTestMode: {
    type: Boolean,
    default: false,
  },
  unityGameIdAndroid: {
    type: String,
    default: "xxxxxxxxxxx",
  },
  unityGameIdIOS: {
    type: String,
    default: "xxxxxxxxxxx",
  },
});

const AdsSetting = mongoose.model("AdsSetting", AdsSettingSchema);
module.exports = AdsSetting;
