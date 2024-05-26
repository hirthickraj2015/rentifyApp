const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const likesAndInterestController = require("../controllers/likesAndInterestController");
const authenticateJWT = require('../middleware/middleware');
const emailController=require('../controllers/emailController')
//User routes
router.post("/register", userController.addUser);
router.post("/login", userController.login);


// Project routes
router.get("/products/:productID", productController.getProjectByProductID);
router.get("/products/user/:userID",productController.getProjectByUserID);
router.post("/addProduct", productController.addProduct);
router.post("/updateProduct",productController.updateProduct);
router.post("/deleteProduct",productController.deleteProduct);
router.post("/products", productController.getAllProjects);



//Likes And Interest routes
router.post("/updateIntrest",likesAndInterestController.updateInterestList);
router.post("/deleteInterest",likesAndInterestController.deleteInterestByUserID);
router.post("/updateLike",likesAndInterestController.updateLikeList);
router.get("/interest/:userID",likesAndInterestController.getInterestListByUserID);
router.get("/like/:userID",likesAndInterestController.getLikeListByUserID);
router.get('/getLikeCount',likesAndInterestController.getLikeCount);



//Email controller
router.post("/sendEmail",emailController.sendInterestEmails);

//JWT Authentication
router.post("/protectedRoute", authenticateJWT, (req, res) => {
    // This route is protected by JWT authentication
    // Access the authenticated user's information using req.user
});

module.exports = router;