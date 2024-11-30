import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false); // Track if signup is successful

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await axios.post('http://localhost:5000/auth/signup', {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      setSignupSuccess(true); // Mark signup as successful
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
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
            {!signupSuccess && (
              <button type="submit" className="login-button">
                Signup
              </button>
            )}
          </form>

          {/* Conditional Link to SelectInterests */}
          {signupSuccess && (
            <div style={{ marginTop: '15px' }}>
              <Link to="/selectinterests" className="login-button">
                Continue to Select Interests
              </Link>
            </div>
          )}

          <div style={{ marginTop: '15px', color:'#161515' }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
