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
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  validity: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Offer", offerSchema);
