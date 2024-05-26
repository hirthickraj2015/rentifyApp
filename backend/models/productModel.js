const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
  productID: String,
  createdByUserID: String,
  type: String,
  name: String,
  area: String,
  price: Number,
  city: String,
  state: String,
  dimension: String,
  likes: Number,
  description: String
});

module.exports = mongoose.model("product_details", productDetailSchema);
