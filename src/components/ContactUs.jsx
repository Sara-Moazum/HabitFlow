import React from 'react'
import "./ContactUs.css"
import './NavBar.css'; 
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook} from "react-icons/fa";


function ContactUs() {
  return (
    <div>
      <header className="navbar">
          <div className="logo">HABITFLOW</div>
          <nav className="nav-links">
            <Link to="/Home">Home</Link>
            <Link to="/Login">Login</Link>
            <Link to="/contactUs">Contact</Link>
            <Link to="/about">About Us</Link>

          </nav>
        </header>
      <div className='outerDiv'>
        
          <div className='leftDiv'>
          <div className="input-fields">
                <input type="text" placeholder="Your Name" required />
              </div>

              <div className="input-fields">
                <input type="email" placeholder="Your Email" required />
              </div>

              <div className="input-fields">
                <input type="text" placeholder="Share your thoughts" required />
              </div>

              <button type="submit" className="feedback-button">Share your Feedback</button>

                
          </div>
          <div className='rightDiv'>
              <h1 style={{fontSize:"50px", marginBottom:"30px"}}>Contact Us</h1>
              <div style={{margin:"20px 0px"}}>For further inquiries, contact us via: </div>
              <div>Email: <span style={{color:"#405BC8", textDecoration:"underline"}}>contact@habitflow.com </span></div>
              <div>Email: <span style={{color:"#405BC8", textDecoration:"underline"}}> support@habitflow.com</span> </div>

              <div style={{margin:"30px 0px"}}>Follow us on Social Media </div>
              <div>
            <FaInstagram style={{ color: "white", marginRight: "8px" }} />
            Instagram: @habitflow
          </div>
          <div>
            <FaFacebook style={{ color: "white", marginRight: "8px" }} />
            Facebook: Habitflow
          </div>


          </div>
        
      </div>
    </div>
  )
}

export default ContactUs
