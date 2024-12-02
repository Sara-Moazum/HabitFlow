import React from "react";
import "./Home.css";
import './NavBar.css'; 
import { Link } from "react-router-dom";

const Home = () => {
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
      
      <div className="home-container">
        {/* Left Content Box */}
        <div className="content-box">
          <h1>
            BUILD BETTER <span style={{ color: "#9f7aea" }}>HABITS</span> EVERYDAY
          </h1>
          <p>
            HabitFlow helps you track, build, and maintain positive habits with
            ease. <br />
            Set goals, monitor progress, and stay motivated.
          </p>
          <Link to="/signUp">
            <button className="signup-button">Signup Free</button>
          </Link>
          <ul className="features-list">
            <li>📌 Set Goals - Create and track your personal goals.</li>
            <li>
              📊 Track Progress - Visualize your habits with insightful charts.
            </li>
            <li>
              🎯 Habit Streaks - Achieve consistency and motivation through a
              streak counter.
            </li>
          </ul>
        </div>

        {/* Right Image Section */}
        <div className="image-box">
          <img
            src="./images/habittracking.png" // Replace with your actual image URL
            alt="Habit Tracking"
            className="hero-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
