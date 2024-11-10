// Import necessary React and CSS dependencies
import React from 'react';
import './Login.css'; // Import a separate CSS file for styling

// Login Component
function Login() {
  return (
    <div className="login-page">
    
      <div className="login-container">
        <div className="background-image">
          <img src="./images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
        
           <h2>LOGIN</h2>
          <form>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Password" required />
            </div>
            <div className="options">
            <label>
                  <input type="checkbox" /> Remember me
            </label>

              <a href="#forgot-password" style={{ color: 'black' }}>Forgot Password?</a>
              </div>
            <button type="submit" className="login-button">Login</button>
          </form> 
        </div>
      </div>

      
    </div>
  );
}

export default Login;
