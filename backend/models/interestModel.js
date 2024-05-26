const mongoose = require('mongoose')

const interestDetailSchema = new mongoose.Schema({
    productID: String,
    userID: String
})

module.exports = mongoose.model("interest_details", interestDetailSchema);