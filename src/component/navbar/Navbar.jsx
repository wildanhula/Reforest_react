import React from "react";
import { Link } from 'react-router-dom';
import "./Navbar.css";

const Navbar = ({ activePage }) => {
  // Dummy profile image (you can replace with your actual image import)
  const profilePic = "https://via.placeholder.com/40"; // 40x40 placeholder
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">Reforest</div>
      <ul className="navbar-menu">
        <li className={`navbar-item ${activePage === 'home' ? 'active' : ''}`}>
          <Link to="/home">Home</Link>
        </li>
        <li className={`navbar-item ${activePage === 'pohonku' ? 'active' : ''}`}>
          <Link to="/pohonku">Pohonku</Link>
        </li>
        <li className={`navbar-item ${activePage === 'artikel' ? 'active' : ''}`}>
          <Link to="/artikel">Artikel</Link>
        </li>
        <li className={`navbar-item ${activePage === 'faqs' ? 'active' : ''}`}>
          <Link to="/faqs">FAQs</Link>
        </li>
        <li className="navbar-profile">
          <Link to="/profile" className="profile-link">
            <img 
              src={profilePic} 
              alt="Profile" 
              className="profile-pic"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;