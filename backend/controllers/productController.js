const productDetails = require("../models/productModel");

const productController = {
  addProduct: async (req, res) => {
    try {
      const product = new productDetails(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Error adding product");
    }
  },
  
  getProjectByProductID: async (req, res) => {
    
    try {
      
      const productID = req.params.productID; 
      const products = await productDetails.find({ productID: productID });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products by user ID:", error);
      res.status(500).send("Error getting products by user ID");
    }
  },
  
  getProjectByUserID: async (req, res) => {

    try {
      const userID = req.params.userID; 
      
      const products = await productDetails.find({ createdByUserID: userID });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products by user ID:", error);
      res.status(500).send("Error getting products by user ID");
    }
  },

  updateProduct: async (req, res) => {
    try {
      // Your logic for updating a product
      const product = await productDetails.findOneAndUpdate({ productID: req.body.productID }, req.body, { new: true });
      res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Error updating product");
    }
  },

  deleteProduct: async (req, res) => {
    try {
      // Your logic for deleting a product
      await productDetails.findOneAndDelete({ productID: req.body.productID });
      res.status(200).send("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Error deleting product");
    }
  },

  getAllProjects: async (req, res) => {
    try {
      let query = {}; // Initialize an empty query object
      // Check if location parameter is provided
      if (req.body.location && req.body.location.toLowerCase() !== "all") {
        // Case insensitive search for city
        query.city = { $regex: new RegExp(req.body.location, "i") };
      }

      // Check if type parameter is provided
      if (req.body.type && req.body.type.toLowerCase() !== "all") {
        // Case insensitive search for type
        query.type = req.body.type;
      }

      // Retrieve products based on the constructed query
      const products = await productDetails.find(query);

      // Send the products as a response
      res.json(products);
    } catch (error) {
      console.error("Error getting all products:", error);
      res.status(500).send("Error getting all products");
    }
  },

  

  
};

module.exports = productController;
