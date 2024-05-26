import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const [userID, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("hi")
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        login(data); // Set the authentication state to logged in and pass the user data
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="User ID"
              value={userID}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
              Login
            </button>
            <button type="button" onClick={() => navigate('/register')} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;