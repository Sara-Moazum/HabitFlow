import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Person, Lock } from '@mui/icons-material'; // Import Material Design icons
import './NavBar.css'; 



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        navigate('/dashboard'); // Redirect to dashboard
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-page">
      <header className="navbar">
      <div className="logo">HABITFLOW</div>
      <nav className="nav-links">
        <Link to="/Home">Home</Link>
        <Link to="/Login">Login</Link>
        <Link to="/contactUs">Contact</Link>
        <Link to="/about">About Us</Link>

      </nav>
    </header>
      <div className="login-container">
        <div className="background-image">
          <img src="/images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
          <Person style={{ fontSize: '60px', color: '#333', marginBottom: '20px' }} /> {/* User profile icon */}
          <h2>LOGIN</h2>

          <form onSubmit={handleLogin}>
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            <div className="input-group">
              <Person style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} /> {/* Person icon */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <Lock style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} /> {/* Lock icon */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="options" style={{ margin: '20px 5px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />{' '}
                Remember me
              </label>


              <a href="/forgetpassword" style={{ color: 'black' }}>
                Forgot Password?
              </a>
            </div>

            <div style={{ color: 'black' }}>
              Don't have an account?{' '}
              <Link to="/signUp" style={{ color: 'black', fontWeight: 'bold' }}>
                SignUp
              </Link>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
