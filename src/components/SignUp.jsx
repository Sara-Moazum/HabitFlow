import React, { useState } from 'react';
import './Login.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests

function SignUp() {
  const navigate = useNavigate(); // To navigate to another page after successful signup

  // State for capturing form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // To handle any error message

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Make POST request to the backend signup route
      await axios.post('http://localhost:5000/auth/signup', {
        firstName,
        lastName,
        username,
        email,
        password,
      });

  
      navigate('/selectinterests'); // Redirect to login page

      // Reset form fields after successful signup
      setFirstName('');
      setLastName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="background-image">
          <img src="./images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
          <h2>SIGNUP</h2>
          <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            <div className="input-group-signup">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">Signup</button>

            <div style={{ color: "black", margin: "15px" }}>
              Already have an account? 
              <Link to="/Login" style={{ color: "black", fontWeight: "bold" }}>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
