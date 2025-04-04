import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <nav className="navbar">
        <h2 className="logo">MyWebsite</h2>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      <header className="hero-section">
        <h1 className="fade-in">Welcome to My Website</h1>
        <p className="slide-in">Explore amazing features with smooth animations!</p>
      </header>
    </div>
  );
};

export default Home;
