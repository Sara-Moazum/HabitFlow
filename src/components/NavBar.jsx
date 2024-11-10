// Import necessary React and CSS dependencies
import React from 'react';
import './NavBar.css'; // Import a separate CSS file for styling

// Login Component
function NavBar() {
  return (
   
    <header className="navbar">
      <div className="logo">HABITFLOW</div>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#login">Login</a>
        <a href="#contact">Contact</a>
        <a href="#about">About Us</a>
      </nav>
    </header>
      
  );
} 
export default NavBar;
