import React from 'react';
import { useAuth } from './AuthContext';
import './styles/Accounts.css'; // Import CSS for custom styling or use a CSS framework


function Accounts() {
  const { user } = useAuth();

  return (
    <div className="account-container">
      <h1 className="account-title">User Account</h1>
      {user ? (
        <div className="user-details">
          <p><strong>User ID:</strong> {user.userDetails.userID}</p>
          <p><strong>Name:</strong> {user.userDetails.firstName} {user.userDetails.lastName}</p>
          <p><strong>Email:</strong> {user.userDetails.mailID}</p>
          <p><strong>Phone:</strong> {user.userDetails.phone}</p>
          <p><strong>Date of Birth:</strong> {new Date(user.userDetails.dob).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {user.userDetails.gender}</p>
          <p><strong>User Type:</strong> {user.userDetails.userType}</p>
        </div>
      ) : (
        <p className="no-user">No user details available. Please log in.</p>
      )}
    </div>
  );
}

export default Accounts