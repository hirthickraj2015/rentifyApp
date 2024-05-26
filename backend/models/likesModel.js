const mongoose = require('mongoose')

const likeDetailSchema = new mongoose.Schema({
    productID: String,
    userID: String
})

module.exports = mongoose.model("like_details", likeDetailSchema);