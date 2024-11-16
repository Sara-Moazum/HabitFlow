import React from 'react';
import './Login.css'; 
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div className="login-page">
    
      <div className="login-container">
        <div className="background-image">
          <img src="./images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
        
           <h2>SIGNUP</h2>
          <form>
            <div className="input-group">
              <input type="text" placeholder="First Name" required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Last Name" required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Username" required />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Confirm Password" required />
            </div>
            
            <button type="submit" className="login-button">Signup</button>
            <div style={{color:"black", margin:"15px"}}>
                Already have an account? <Link to="/" style={{color:"black", fontWeight:"bold"}}>Login</Link>
              </div>
          </form> 
        </div>
      </div>

      
    </div>
  );
}

export default SignUp;
