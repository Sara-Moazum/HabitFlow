// Import necessary dependencies
import React from 'react';
import './AboutUs.css'; // CSS file for styling
import './NavBar.css'; 
import { Link } from "react-router-dom";


// About Us Component
function AboutUs() {
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
      <div className="about-us-section">
        
        <h2>ABOUT US</h2>
        <hr className="divider" />
        <p>
          Welcome to HabitFlow! We're here to make habit-building easier and more rewarding. 
          Our mission is to support you in creating positive routines, tracking your progress, 
          and celebrating small wins along the way.<br /><br />
          Join us on a journey to better habits and a better you!     
        </p>
          
      </div>
    </div>
  );
}

export default AboutUs;
