const mongoose = require('mongoose');

const SliderSettingSchema = new mongoose.Schema({
  sliderType: {
    type: String,
    required: true,
    enum: ['Latest Movie/Series', 'Image Slider', 'Latest TV Channel', 'Disable'],
  },
  totalContent: {
    type: Number,
    required: true,
    min: 1, // You can adjust this minimum as needed
  },
}, { timestamps: true });

const SliderSetting = mongoose.model('SliderSetting', SliderSettingSchema);

module.exports = SliderSetting;
