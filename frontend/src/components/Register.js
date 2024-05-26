import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    dob: '',
    mailID: '',
    phone: '',
    gender: 'Male', // Default value for gender
    userType: 'buyer', // Default value for userType
    password: '', // Add password field
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('User registered successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          {Object.keys(userDetails).map((key) => (
            key !== 'userType' && key !== 'gender' && // Skip userType and gender for now, handle separately
            <div key={key} className="mb-4">
              <input
                type={key === 'dob' ? 'date' : key === 'password' ? 'password' : 'text'}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={userDetails[key]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
            <select
              name="gender"
              value={userDetails.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">User Type</label>
            <select
              name="userType"
              value={userDetails.userType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
              Register
            </button>
            <button type="button" onClick={() => navigate('/login')} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700">
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
