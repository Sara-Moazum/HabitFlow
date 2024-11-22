import React from 'react';
import './NavBar.css'; 
import { Link } from "react-router-dom";

function NavBar() {
  return (
   
    <header className="navbar">
      <div className="logo">HABITFLOW</div>
      <nav className="nav-links">
        <Link to="/Home">Home</Link>
        <Link to="/">Login</Link>
        <Link to="/contactUs">Contact</Link>
        <Link to="/about">About Us</Link>

      </nav>
    </header>
      
  );
} 
export default NavBar;
