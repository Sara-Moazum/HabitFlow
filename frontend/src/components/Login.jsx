//login .jsx
import React, { useState,useEffect} from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Person, Lock } from '@mui/icons-material';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');


  const navigate = useNavigate();

  // Fetch remembered data on component mount
  useEffect(() => {
    const rememberData = JSON.parse(localStorage.getItem('rememberMe'));
    if (rememberData) {
      setEmail(rememberData.email || '');
      setPassword(rememberData.password || '');
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

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

        // Save rememberMe data
        if (rememberMe) {
          localStorage.setItem(
            'rememberMe',
            JSON.stringify({ email, password })
          );
        } else {
          localStorage.removeItem('rememberMe');
        }

        navigate('/selectinterests'); // Redirect to Select Interests page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="background-image">
          <img src="/images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
          <Person style={{ fontSize: '60px', color: '#333', marginBottom: '20px' }} />
          <h2>LOGIN</h2>


          <form onSubmit={handleLogin}>
            {error && <div style={{ color: 'purple', marginBottom: '20px' }}>{error}</div>}
            <div className="input-group">
              <Person
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ccc',
                }}
              />
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
              <Link to="/forgetpassword">Forgot Password?</Link>
            </div>
            <div className="account">
              Don't have an account? <Link to="/signup">SignUp</Link>
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