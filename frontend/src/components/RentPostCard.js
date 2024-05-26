import React, { useState } from "react";
import "./styles/RentPostCard.css";
import { useAuth } from "./AuthContext";
import likeIcon from "../assets/like.png";
import axios from "axios";

const RentPostCard = ({ post }) => {
  const { isLoggedIn, user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);

    try {
      const requestBody = {
        productID: post.productID,
        likeCount: likes + (newLikeStatus ? 1 : -1),
        userID: isLoggedIn ? user.userDetails.userID : null,
      };

      await axios.post("/updateLike", requestBody);

      const response = await axios.get(`/getLikeCount?productID=${post.productID}`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCardClick = () => {
    if (isLoggedIn) {
      setIsPopupOpen(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleInterestedClick = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    setIsInterested(!isInterested);

    try {
      const requestBody = {
        userID: user.userDetails.userID,
        productID: post.productID,
      };

      await axios.post("/sendEmail", requestBody);
    } catch (error) {
      console.error("Error sending interest:", error);
    }
  };

  return (
    <>
      <div className="rent-post-card" onClick={handleCardClick}>
        <h2>{post.name}</h2>
        <p><strong>Type:</strong> {post.type}</p>
        <p>
          <strong>Price:</strong>{" "}
          <span className={isLoggedIn ? "" : "blurred"}>{post.price}</span>
        </p>
        <p><strong>City:</strong> {post.city}</p>
        <div className="icons">
          <button
            className={`icon-button ${isLiked ? "active" : ""}`}
            onClick={handleLike}
          >
            <img src={likeIcon} alt="Like" className="icon" />
            {likes}
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Product Details</h2>
            <p><strong>Name:</strong> {post.name}</p>
            <p><strong>Type:</strong> {post.type}</p>
            <p><strong>Area:</strong> {post.area}</p>
            <p><strong>Price:</strong> {post.price}</p>
            <p><strong>City:</strong> {post.city}</p>
            <p><strong>State:</strong> {post.state}</p>
            <p><strong>Dimension:</strong> {post.dimension}</p>
            <p><strong>Description:</strong> {post.description}</p>
            <div className="popup-buttons">
              <button
                className={`interested-button ${isInterested ? "active-interested" : ""}`}
                onClick={handleInterestedClick}
              >
                Interested
              </button>
              <button className="close-button" onClick={handleClosePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginPrompt && (
        <div className="popup-overlay">
          <div className="popup-content login-prompt">
            <div className="login-content">
              <h2>Please Login</h2>
              <p>You need to login to see full information.</p>
              <button className="close-button" onClick={handleCloseLoginPrompt}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RentPostCard;
