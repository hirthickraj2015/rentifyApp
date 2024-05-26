const likesDetails = require("../models/likesModel");
const interestDetails = require("../models/interestModel");
const Product = require("../models/productModel");

const likesAndInterestController = {
  deleteInterestByUserID: async (req, res) => {
    const { userID, productID } = req.body;
    try {
        // Delete the interest based on user ID and product ID
        await interestDetails.deleteOne({ userID: userID, productID: productID });
        res.status(200).send("Interest removed");
    } catch (error) {
        console.error("Error deleting interest:", error);
        res.status(500).send("Error deleting interest");
    }
  },
  updateInterestList: async (req, res) => {
    const { userID, productID } = req.body;

    try {
      // Check if the interest already exists
      const existingInterest = await interestDetails.findOne({
        userID,
        productID,
      });
      if (existingInterest) {
        return res.status(200).send("Interest already exists");
      }

      // Add new interest
      const newInterest = new interestDetails({
        userID,
        productID,
      });

      await newInterest.save();
      res.status(200).send("Interest updated successfully");
    } catch (error) {
      console.error("Error updating interest:", error);
      res.status(500).send("Error updating interest");
    }
  },

  updateLikeList: async (req, res) => {
    const { productID, likeCount, userID } = req.body;
    console.log(productID, likeCount, userID);
    try {
      // Convert productID to string
      const stringProductID = String(productID);

      // Convert likeCount to a number
      const numericLikeCount = Number(likeCount);

      // Retrieve the product from the database using its ID
      const product = await Product.findOne({ productID: stringProductID });

      // Check if the product exists
      if (!product) {
        // If the product doesn't exist, return an error response
        return res.status(404).send("Product not found");
      }

      // Update the like count of the retrieved product
      product.likes = numericLikeCount;

      // Save the updated product back to the database
      await product.save();

      // If userID is provided, insert a record into like_details table
      if (userID) {
        const newLikeDetail = new likesDetails({
          productID: stringProductID,
          userID: userID,
        });
        await newLikeDetail.save();
      }

      // Return success response
      res.status(200).send("Like count updated successfully");
    } catch (error) {
      console.error("Error updating like count:", error);
      res.status(500).send("Error updating like count");
    }
  },

  getLikeCount: async (req, res) => {
    try {
      const { productID } = req.query;
      const product = await Product.findOne({ productID });

      if (product) {
        res.json({ likes: product.likes });
      } else {
        res.status(404).send("Product not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },

  getInterestListByUserID: async (req, res) => {
    const userID = req.params.userID;
    
    try {
      // Fetch interest list from the database based on user ID
      const interestList = await interestDetails.find({ userID: userID });
      res.status(200).json(interestList);
    } catch (error) {
      console.error("Error getting interest list by user ID:", error);
      res.status(500).send("Error getting interest list by user ID");
    }
  },

  getLikeListByUserID: async (req, res) => {
    try {
      const userID = req.params.userID;
      // Your logic for getting products by user ID
      // Example:
      const products = await Product.find({ createdByUserID:userID });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products by user ID:", error);
      res.status(500).send("Error getting products by user ID");
    }
  },
};

module.exports = likesAndInterestController;
