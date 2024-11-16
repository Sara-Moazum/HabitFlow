import React from 'react';
import './Login.css'; 
import { Link } from 'react-router-dom';

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
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" required />
            </div>
            <div className="options" style={{margin:"20px 5px"}}>
            <label>
                  <input type="checkbox" /> Remember me
            </label>

              <a href="#forgot-password" style={{ color: 'black' }}>Forgot Password?</a>
              </div>
              <div style={{color:"black"}}>
                Don't have an account? <Link to="/signUp" style={{color:"black", fontWeight:"bold"}}>SignUp</Link>
              </div>
            <button type="submit" className="login-button">Login</button>
          </form> 
        </div>
      </div>

      
    </div>
  );
}

export default Login;
