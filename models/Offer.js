const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:""
  },
  price: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Offer", offerSchema);
