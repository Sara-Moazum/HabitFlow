import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Person, Lock } from '@mui/icons-material'; // Import Material Design icons
import './NavBar.css'; // Include NavBar styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => password.length >= 6;

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
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        localStorage.setItem('userId', response.data.userId); // Store userId for future use

        // Redirect based on user state
        const hasSelectedInterests = response.data.hasSelectedInterests; // Ensure backend sends this
        if (hasSelectedInterests) {
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          navigate('/selectinterests'); // Redirect to select interests
        }

        window.location.reload(); // Optional: Refresh state across components
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      {/* NavBar */}
      <header className="navbar">
        <div className="logo">HABITFLOW</div>
        <nav className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/contactUs">Contact</Link>
          <Link to="/about">About Us</Link>
        </nav>
      </header>

      {/* Login Form */}
      <div className="login-container">
        <div className="background-image">
          <img src="/images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
          <Person style={{ fontSize: '60px', color: '#333' }} />
          <h2>LOGIN</h2>

          <form onSubmit={handleLogin}>
            {error && <div style={{ color: 'purple', marginBottom: '20px' }}>{error}</div>}
            <div className="input-group">
              <Person className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <Lock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />{' '}
                Remember me
              </label>
              <Link to="/forgetpassword" style={{ color: '#000000' }}>
                Forgot Password?
              </Link>
            </div>
            <div className="account">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#000000' }}>
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
