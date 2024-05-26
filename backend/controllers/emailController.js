const userDetails = require("../models/userModel");
const productDetails = require("../models/productModel");
const nodemailer = require("nodemailer");
const interestDetails = require("../models/interestModel");
require("dotenv").config({ path: "../../.env" });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: true,
});

const emailController = {
  sendInterestEmails: async (req, res) => {
    const { userID, productID } = req.body;

    try {
      // Find the interest record with the given userID and productID
      const existingInterest = await interestDetails.findOne({
        userID,
        productID,
      });
      // if (!existingInterest) {
      //   return res.status(404).send("Interest not found");
      // }

      // Fetch user details
      const user = await userDetails.findOne({ userID: userID });
      if (!user) {
        return res.status(404).send("User not found");
      }
      // Fetch product details
      const product = await productDetails
        .findOne({ productID: productID })
        .populate("createdByUserID");
      if (!product) {
        return res.status(404).send("Product not found");
      }

      const sellerID = product.createdByUserID;
      const seller = await userDetails.findOne({ userID: sellerID });
      if (!seller) {
        return res.status(404).send("Seller not found");
      }
      // Send email to the user
      const userMailOptions = {
        from: process.env.MAIL_ID,
        to: user.mailID,
        subject: "Details of the Product and Seller",
        text: `Hi ${user.firstName},

            You have shown interest in the product "${product.name}". Here are the details:

            Product Name: ${product.name}
            Product Description: ${product.description}
            Product Price: ${product.price}

            Seller Name: ${seller.firstName}
            Seller Email: ${seller.mailID}
            Seller Phone: ${seller.phone}

            Thank you for your interest!

            Best regards,
            Rentify`,
      };
      await transporter.sendMail(userMailOptions);

      // Send email to the seller
      const sellerMailOptions = {
        from: process.env.MAIL_ID,
        to: seller.mailID,
        subject: "A Buyer is Interested in Your Product",
        text: `Hi ${seller.firstName},

            A user has shown interest in your product "${product.name}". Here are the details of the interested buyer:

            Buyer Name: ${user.firstName}
            Buyer Email: ${user.mailID}
            Buyer Phone: ${user.phone}

            Please reach out to the buyer to proceed further.

            Best regards,
            Rentify`,
      };

      await transporter.sendMail(sellerMailOptions);

      // Update the interest_details table
      const interestDetail = new interestDetails({
        productID: product.productID,
        userID: user.userID,
      });

      await interestDetail.save();

      res
        .status(200)
        .send("Emails sent and interest details updated successfully");
    } catch (error) {
      console.error("Error sending emails:", error);
      res.status(500).send("Error sending emails");
    }
  },
};

module.exports = emailController;
